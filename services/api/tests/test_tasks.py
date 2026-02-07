"""Tests for task CRUD endpoints."""

import uuid

import pytest
from httpx import AsyncClient


# ---------------------------------------------------------------------------
# US1: Create a Task
# ---------------------------------------------------------------------------


class TestCreateTask:
    """Tests for POST /tasks."""

    async def test_create_with_title_only(self, client: AsyncClient):
        resp = await client.post("/tasks", json={"title": "Buy groceries"})
        assert resp.status_code == 201
        data = resp.json()
        assert data["title"] == "Buy groceries"
        assert data["description"] is None
        assert data["completed"] is False
        assert "id" in data
        assert "created_at" in data
        assert "updated_at" in data
        # Internal fields must not be exposed
        assert "user_id" not in data
        assert "is_deleted" not in data

    async def test_create_with_title_and_description(self, client: AsyncClient):
        resp = await client.post(
            "/tasks",
            json={"title": "Buy groceries", "description": "Milk, eggs, bread"},
        )
        assert resp.status_code == 201
        data = resp.json()
        assert data["title"] == "Buy groceries"
        assert data["description"] == "Milk, eggs, bread"

    async def test_create_empty_title_rejected(self, client: AsyncClient):
        resp = await client.post("/tasks", json={"title": ""})
        assert resp.status_code == 422

    async def test_create_title_too_long_rejected(self, client: AsyncClient):
        resp = await client.post("/tasks", json={"title": "x" * 201})
        assert resp.status_code == 422

    async def test_create_description_too_long_rejected(self, client: AsyncClient):
        resp = await client.post(
            "/tasks", json={"title": "Test", "description": "x" * 2001}
        )
        assert resp.status_code == 422

    async def test_create_without_auth_rejected(self, unauthed_client: AsyncClient):
        resp = await unauthed_client.post("/tasks", json={"title": "Test"})
        assert resp.status_code == 401

    async def test_create_response_omits_internal_fields(self, client: AsyncClient):
        resp = await client.post("/tasks", json={"title": "Test"})
        data = resp.json()
        assert "user_id" not in data
        assert "is_deleted" not in data


# ---------------------------------------------------------------------------
# US2: List My Tasks
# ---------------------------------------------------------------------------


class TestListTasks:
    """Tests for GET /tasks."""

    async def test_list_empty(self, client: AsyncClient):
        resp = await client.get("/tasks")
        assert resp.status_code == 200
        data = resp.json()
        assert data["data"] == []
        assert data["total"] == 0
        assert data["page"] == 1
        assert data["per_page"] == 20
        assert data["total_pages"] == 0

    async def test_list_returns_tasks_newest_first(self, client: AsyncClient):
        titles = [f"Task {i}" for i in range(5)]
        for t in titles:
            await client.post("/tasks", json={"title": t})

        resp = await client.get("/tasks")
        data = resp.json()
        assert data["total"] == 5
        assert len(data["data"]) == 5
        # Newest first
        returned_titles = [d["title"] for d in data["data"]]
        assert returned_titles == list(reversed(titles))

    async def test_list_pagination(self, client: AsyncClient):
        for i in range(25):
            await client.post("/tasks", json={"title": f"Task {i}"})

        # Page 1
        resp = await client.get("/tasks", params={"per_page": 10, "page": 1})
        data = resp.json()
        assert len(data["data"]) == 10
        assert data["total"] == 25
        assert data["total_pages"] == 3

        # Page 3 (last page)
        resp = await client.get("/tasks", params={"per_page": 10, "page": 3})
        data = resp.json()
        assert len(data["data"]) == 5
        assert data["total"] == 25

    async def test_list_filter_completed(self, client: AsyncClient):
        # Create 3 tasks, complete 1
        r1 = await client.post("/tasks", json={"title": "A"})
        await client.post("/tasks", json={"title": "B"})
        await client.post("/tasks", json={"title": "C"})
        task_id = r1.json()["id"]
        await client.patch(f"/tasks/{task_id}", json={"completed": True})

        # Only completed
        resp = await client.get("/tasks", params={"completed": True})
        data = resp.json()
        assert len(data["data"]) == 1
        assert data["data"][0]["completed"] is True

        # Only incomplete
        resp = await client.get("/tasks", params={"completed": False})
        data = resp.json()
        assert len(data["data"]) == 2
        for task in data["data"]:
            assert task["completed"] is False

    async def test_list_excludes_soft_deleted(self, client: AsyncClient):
        r = await client.post("/tasks", json={"title": "Delete me"})
        task_id = r.json()["id"]
        await client.delete(f"/tasks/{task_id}")

        resp = await client.get("/tasks")
        data = resp.json()
        assert data["total"] == 0

    async def test_list_user_isolation(
        self, client: AsyncClient, other_client: AsyncClient
    ):
        # User A creates a task
        await client.post("/tasks", json={"title": "User A task"})
        # User B creates a task
        await other_client.post("/tasks", json={"title": "User B task"})

        # User A sees only their task
        resp = await client.get("/tasks")
        data = resp.json()
        assert data["total"] == 1
        assert data["data"][0]["title"] == "User A task"

        # User B sees only their task
        resp = await other_client.get("/tasks")
        data = resp.json()
        assert data["total"] == 1
        assert data["data"][0]["title"] == "User B task"

    async def test_list_page_beyond_total(self, client: AsyncClient):
        await client.post("/tasks", json={"title": "Only one"})
        resp = await client.get("/tasks", params={"page": 99})
        data = resp.json()
        assert data["data"] == []
        assert data["total"] == 1
        assert data["page"] == 99


# ---------------------------------------------------------------------------
# US3: View a Single Task
# ---------------------------------------------------------------------------


class TestGetTask:
    """Tests for GET /tasks/{task_id}."""

    async def test_get_own_task(self, client: AsyncClient):
        r = await client.post("/tasks", json={"title": "My task"})
        task_id = r.json()["id"]

        resp = await client.get(f"/tasks/{task_id}")
        assert resp.status_code == 200
        data = resp.json()
        assert data["id"] == task_id
        assert data["title"] == "My task"
        assert "created_at" in data
        assert "updated_at" in data

    async def test_get_nonexistent(self, client: AsyncClient):
        fake_id = str(uuid.uuid4())
        resp = await client.get(f"/tasks/{fake_id}")
        assert resp.status_code == 404

    async def test_get_other_users_task(
        self, client: AsyncClient, other_client: AsyncClient
    ):
        r = await client.post("/tasks", json={"title": "Private"})
        task_id = r.json()["id"]

        resp = await other_client.get(f"/tasks/{task_id}")
        assert resp.status_code == 404

    async def test_get_soft_deleted(self, client: AsyncClient):
        r = await client.post("/tasks", json={"title": "Deleted"})
        task_id = r.json()["id"]
        await client.delete(f"/tasks/{task_id}")

        resp = await client.get(f"/tasks/{task_id}")
        assert resp.status_code == 404

    async def test_get_invalid_uuid(self, client: AsyncClient):
        resp = await client.get("/tasks/not-a-uuid")
        assert resp.status_code == 422


# ---------------------------------------------------------------------------
# US4: Update a Task
# ---------------------------------------------------------------------------


class TestUpdateTask:
    """Tests for PATCH /tasks/{task_id}."""

    async def test_update_title_only(self, client: AsyncClient):
        r = await client.post("/tasks", json={"title": "Old title"})
        data = r.json()
        task_id = data["id"]
        original_updated_at = data["updated_at"]

        resp = await client.patch(
            f"/tasks/{task_id}", json={"title": "New title"}
        )
        assert resp.status_code == 200
        updated = resp.json()
        assert updated["title"] == "New title"
        assert updated["description"] is None  # unchanged
        assert updated["completed"] is False  # unchanged
        assert updated["updated_at"] != original_updated_at

    async def test_update_completed(self, client: AsyncClient):
        r = await client.post("/tasks", json={"title": "Test"})
        task_id = r.json()["id"]

        resp = await client.patch(
            f"/tasks/{task_id}", json={"completed": True}
        )
        assert resp.status_code == 200
        assert resp.json()["completed"] is True

    async def test_update_description_only(self, client: AsyncClient):
        r = await client.post("/tasks", json={"title": "Test"})
        task_id = r.json()["id"]

        resp = await client.patch(
            f"/tasks/{task_id}", json={"description": "New desc"}
        )
        assert resp.status_code == 200
        assert resp.json()["description"] == "New desc"
        assert resp.json()["title"] == "Test"  # unchanged

    async def test_update_multiple_fields(self, client: AsyncClient):
        r = await client.post("/tasks", json={"title": "Test"})
        task_id = r.json()["id"]

        resp = await client.patch(
            f"/tasks/{task_id}",
            json={"title": "Updated", "description": "Desc", "completed": True},
        )
        assert resp.status_code == 200
        data = resp.json()
        assert data["title"] == "Updated"
        assert data["description"] == "Desc"
        assert data["completed"] is True

    async def test_update_empty_body(self, client: AsyncClient):
        r = await client.post("/tasks", json={"title": "Test"})
        task_id = r.json()["id"]

        resp = await client.patch(f"/tasks/{task_id}", json={})
        assert resp.status_code == 200
        assert resp.json()["title"] == "Test"  # unchanged

    async def test_update_other_users_task(
        self, client: AsyncClient, other_client: AsyncClient
    ):
        r = await client.post("/tasks", json={"title": "Private"})
        task_id = r.json()["id"]

        resp = await other_client.patch(
            f"/tasks/{task_id}", json={"title": "Hacked"}
        )
        assert resp.status_code == 404

    async def test_update_soft_deleted_task(self, client: AsyncClient):
        r = await client.post("/tasks", json={"title": "Deleted"})
        task_id = r.json()["id"]
        await client.delete(f"/tasks/{task_id}")

        resp = await client.patch(
            f"/tasks/{task_id}", json={"title": "Updated"}
        )
        assert resp.status_code == 404

    async def test_update_empty_title_rejected(self, client: AsyncClient):
        r = await client.post("/tasks", json={"title": "Test"})
        task_id = r.json()["id"]

        resp = await client.patch(f"/tasks/{task_id}", json={"title": ""})
        assert resp.status_code == 422

    async def test_update_response_omits_internal_fields(self, client: AsyncClient):
        r = await client.post("/tasks", json={"title": "Test"})
        task_id = r.json()["id"]

        resp = await client.patch(
            f"/tasks/{task_id}", json={"title": "Updated"}
        )
        data = resp.json()
        assert "user_id" not in data
        assert "is_deleted" not in data


# ---------------------------------------------------------------------------
# US5: Delete a Task
# ---------------------------------------------------------------------------


class TestDeleteTask:
    """Tests for DELETE /tasks/{task_id}."""

    async def test_delete_own_task(self, client: AsyncClient):
        r = await client.post("/tasks", json={"title": "Delete me"})
        task_id = r.json()["id"]

        resp = await client.delete(f"/tasks/{task_id}")
        assert resp.status_code == 204
        assert resp.content == b""

    async def test_delete_then_get_returns_404(self, client: AsyncClient):
        r = await client.post("/tasks", json={"title": "Delete me"})
        task_id = r.json()["id"]
        await client.delete(f"/tasks/{task_id}")

        resp = await client.get(f"/tasks/{task_id}")
        assert resp.status_code == 404

    async def test_delete_already_deleted(self, client: AsyncClient):
        r = await client.post("/tasks", json={"title": "Delete me"})
        task_id = r.json()["id"]
        await client.delete(f"/tasks/{task_id}")

        resp = await client.delete(f"/tasks/{task_id}")
        assert resp.status_code == 404

    async def test_delete_excluded_from_list(self, client: AsyncClient):
        r = await client.post("/tasks", json={"title": "Delete me"})
        task_id = r.json()["id"]
        await client.post("/tasks", json={"title": "Keep me"})
        await client.delete(f"/tasks/{task_id}")

        resp = await client.get("/tasks")
        data = resp.json()
        assert data["total"] == 1
        assert data["data"][0]["title"] == "Keep me"

    async def test_delete_other_users_task(
        self, client: AsyncClient, other_client: AsyncClient
    ):
        r = await client.post("/tasks", json={"title": "Private"})
        task_id = r.json()["id"]

        resp = await other_client.delete(f"/tasks/{task_id}")
        assert resp.status_code == 404

    async def test_delete_nonexistent(self, client: AsyncClient):
        fake_id = str(uuid.uuid4())
        resp = await client.delete(f"/tasks/{fake_id}")
        assert resp.status_code == 404
