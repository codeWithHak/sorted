"""Unit tests for agent tools."""

import uuid

import pytest
import pytest_asyncio
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlmodel import SQLModel

from src.api.agent.context import ChatContext
from src.api.models.task import Task
from src.api.models.user import User

# Test database setup
_test_engine = create_async_engine("sqlite+aiosqlite://", echo=False)
_test_session_factory = async_sessionmaker(
    _test_engine, class_=AsyncSession, expire_on_commit=False
)

TEST_USER_ID = "11111111-1111-1111-1111-111111111111"
OTHER_USER_ID = "22222222-2222-2222-2222-222222222222"


@pytest_asyncio.fixture(autouse=True)
async def setup_db():
    async with _test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.create_all)
    yield
    async with _test_engine.begin() as conn:
        await conn.run_sync(SQLModel.metadata.drop_all)


@pytest_asyncio.fixture
async def session():
    async with _test_session_factory() as session:
        yield session


@pytest_asyncio.fixture
async def ctx():
    return ChatContext(
        user_id=TEST_USER_ID,
        thread_id=str(uuid.uuid4()),
    )


@pytest_asyncio.fixture
async def sample_tasks(session: AsyncSession):
    """Create sample tasks for testing."""
    tasks = []
    for i, (title, completed) in enumerate([
        ("Buy groceries", False),
        ("Read a book", False),
        ("Clean the house", True),
    ]):
        task = Task(
            title=title,
            completed=completed,
            user_id=uuid.UUID(TEST_USER_ID),
        )
        session.add(task)
        tasks.append(task)
    await session.commit()
    for t in tasks:
        await session.refresh(t)
    return tasks


@pytest_asyncio.fixture
async def other_user_task(session: AsyncSession):
    """Create a task owned by another user."""
    task = Task(
        title="Other user task",
        completed=False,
        user_id=uuid.UUID(OTHER_USER_ID),
    )
    session.add(task)
    await session.commit()
    await session.refresh(task)
    return task


# ── add_task tests ──


class TestAddTask:
    @pytest.mark.asyncio
    async def test_creates_task_for_user(self, ctx, session, monkeypatch):
        import json
        from src.api.agent import tools as tools_mod

        monkeypatch.setattr(tools_mod, "_get_tool_session_factory", lambda: _test_session_factory)

        from agents import RunContextWrapper
        wrapper = RunContextWrapper(context=ctx)

        result = await tools_mod._add_task_impl(wrapper, "Buy milk", None)
        data = json.loads(result)

        assert "id" in data
        assert data["title"] == "Buy milk"
        assert data["completed"] is False
        assert ctx.tasks_modified is True
        assert len(ctx.modified_tasks) == 1
        assert ctx.modified_tasks[0][0] == "created"

    @pytest.mark.asyncio
    async def test_rejects_empty_title(self, ctx, monkeypatch):
        import json
        from src.api.agent import tools as tools_mod

        monkeypatch.setattr(tools_mod, "_get_tool_session_factory", lambda: _test_session_factory)

        from agents import RunContextWrapper
        wrapper = RunContextWrapper(context=ctx)

        result = await tools_mod._add_task_impl(wrapper, "", None)
        data = json.loads(result)
        assert data["error"] == "VALIDATION_ERROR"


# ── list_tasks tests ──


class TestListTasks:
    @pytest.mark.asyncio
    async def test_lists_all_user_tasks(self, ctx, session, sample_tasks, monkeypatch):
        import json
        from src.api.agent import tools as tools_mod

        monkeypatch.setattr(tools_mod, "_get_tool_session_factory", lambda: _test_session_factory)

        from agents import RunContextWrapper
        wrapper = RunContextWrapper(context=ctx)

        result = await tools_mod._list_tasks_impl(wrapper, None)
        data = json.loads(result)
        assert data["total"] == 3

    @pytest.mark.asyncio
    async def test_filters_completed(self, ctx, session, sample_tasks, monkeypatch):
        import json
        from src.api.agent import tools as tools_mod

        monkeypatch.setattr(tools_mod, "_get_tool_session_factory", lambda: _test_session_factory)

        from agents import RunContextWrapper
        wrapper = RunContextWrapper(context=ctx)

        result = await tools_mod._list_tasks_impl(wrapper, True)
        data = json.loads(result)
        assert data["total"] == 1
        assert data["tasks"][0]["title"] == "Clean the house"

    @pytest.mark.asyncio
    async def test_filters_pending(self, ctx, session, sample_tasks, monkeypatch):
        import json
        from src.api.agent import tools as tools_mod

        monkeypatch.setattr(tools_mod, "_get_tool_session_factory", lambda: _test_session_factory)

        from agents import RunContextWrapper
        wrapper = RunContextWrapper(context=ctx)

        result = await tools_mod._list_tasks_impl(wrapper, False)
        data = json.loads(result)
        assert data["total"] == 2

    @pytest.mark.asyncio
    async def test_empty_list(self, ctx, monkeypatch):
        import json
        from src.api.agent import tools as tools_mod

        monkeypatch.setattr(tools_mod, "_get_tool_session_factory", lambda: _test_session_factory)

        from agents import RunContextWrapper
        wrapper = RunContextWrapper(context=ctx)

        result = await tools_mod._list_tasks_impl(wrapper, None)
        data = json.loads(result)
        assert data["total"] == 0
        assert data["tasks"] == []

    @pytest.mark.asyncio
    async def test_user_isolation(self, ctx, session, other_user_task, monkeypatch):
        import json
        from src.api.agent import tools as tools_mod

        monkeypatch.setattr(tools_mod, "_get_tool_session_factory", lambda: _test_session_factory)

        from agents import RunContextWrapper
        wrapper = RunContextWrapper(context=ctx)

        result = await tools_mod._list_tasks_impl(wrapper, None)
        data = json.loads(result)
        assert data["total"] == 0


# ── complete_task tests ──


class TestCompleteTask:
    @pytest.mark.asyncio
    async def test_marks_task_complete(self, ctx, session, sample_tasks, monkeypatch):
        import json
        from src.api.agent import tools as tools_mod

        monkeypatch.setattr(tools_mod, "_get_tool_session_factory", lambda: _test_session_factory)

        from agents import RunContextWrapper
        wrapper = RunContextWrapper(context=ctx)

        task_id = str(sample_tasks[0].id)
        result = await tools_mod._complete_task_impl(wrapper, task_id)
        data = json.loads(result)
        assert data["completed"] is True
        assert ctx.tasks_modified is True

    @pytest.mark.asyncio
    async def test_not_found_for_invalid_id(self, ctx, monkeypatch):
        import json
        from src.api.agent import tools as tools_mod

        monkeypatch.setattr(tools_mod, "_get_tool_session_factory", lambda: _test_session_factory)

        from agents import RunContextWrapper
        wrapper = RunContextWrapper(context=ctx)

        result = await tools_mod._complete_task_impl(wrapper, str(uuid.uuid4()))
        data = json.loads(result)
        assert data["error"] == "NOT_FOUND"

    @pytest.mark.asyncio
    async def test_isolation_other_user_task(self, ctx, session, other_user_task, monkeypatch):
        import json
        from src.api.agent import tools as tools_mod

        monkeypatch.setattr(tools_mod, "_get_tool_session_factory", lambda: _test_session_factory)

        from agents import RunContextWrapper
        wrapper = RunContextWrapper(context=ctx)

        result = await tools_mod._complete_task_impl(wrapper, str(other_user_task.id))
        data = json.loads(result)
        assert data["error"] == "NOT_FOUND"


# ── update_task tests ──


class TestUpdateTask:
    @pytest.mark.asyncio
    async def test_updates_title(self, ctx, session, sample_tasks, monkeypatch):
        import json
        from src.api.agent import tools as tools_mod

        monkeypatch.setattr(tools_mod, "_get_tool_session_factory", lambda: _test_session_factory)

        from agents import RunContextWrapper
        wrapper = RunContextWrapper(context=ctx)

        task_id = str(sample_tasks[0].id)
        result = await tools_mod._update_task_impl(wrapper, task_id, "Weekly shopping", None)
        data = json.loads(result)
        assert data["title"] == "Weekly shopping"

    @pytest.mark.asyncio
    async def test_not_found(self, ctx, monkeypatch):
        import json
        from src.api.agent import tools as tools_mod

        monkeypatch.setattr(tools_mod, "_get_tool_session_factory", lambda: _test_session_factory)

        from agents import RunContextWrapper
        wrapper = RunContextWrapper(context=ctx)

        result = await tools_mod._update_task_impl(wrapper, str(uuid.uuid4()), "New", None)
        data = json.loads(result)
        assert data["error"] == "NOT_FOUND"

    @pytest.mark.asyncio
    async def test_rejects_empty_title(self, ctx, session, sample_tasks, monkeypatch):
        import json
        from src.api.agent import tools as tools_mod

        monkeypatch.setattr(tools_mod, "_get_tool_session_factory", lambda: _test_session_factory)

        from agents import RunContextWrapper
        wrapper = RunContextWrapper(context=ctx)

        task_id = str(sample_tasks[0].id)
        result = await tools_mod._update_task_impl(wrapper, task_id, "", None)
        data = json.loads(result)
        assert data["error"] == "VALIDATION_ERROR"


# ── delete_task tests ──


class TestDeleteTask:
    @pytest.mark.asyncio
    async def test_soft_deletes_task(self, ctx, session, sample_tasks, monkeypatch):
        import json
        from src.api.agent import tools as tools_mod

        monkeypatch.setattr(tools_mod, "_get_tool_session_factory", lambda: _test_session_factory)

        from agents import RunContextWrapper
        wrapper = RunContextWrapper(context=ctx)

        task_id = str(sample_tasks[0].id)
        result = await tools_mod._delete_task_impl(wrapper, task_id)
        data = json.loads(result)
        assert data["status"] == "deleted"
        assert ctx.tasks_modified is True

    @pytest.mark.asyncio
    async def test_not_found(self, ctx, monkeypatch):
        import json
        from src.api.agent import tools as tools_mod

        monkeypatch.setattr(tools_mod, "_get_tool_session_factory", lambda: _test_session_factory)

        from agents import RunContextWrapper
        wrapper = RunContextWrapper(context=ctx)

        result = await tools_mod._delete_task_impl(wrapper, str(uuid.uuid4()))
        data = json.loads(result)
        assert data["error"] == "NOT_FOUND"

    @pytest.mark.asyncio
    async def test_isolation(self, ctx, session, other_user_task, monkeypatch):
        import json
        from src.api.agent import tools as tools_mod

        monkeypatch.setattr(tools_mod, "_get_tool_session_factory", lambda: _test_session_factory)

        from agents import RunContextWrapper
        wrapper = RunContextWrapper(context=ctx)

        result = await tools_mod._delete_task_impl(wrapper, str(other_user_task.id))
        data = json.loads(result)
        assert data["error"] == "NOT_FOUND"
