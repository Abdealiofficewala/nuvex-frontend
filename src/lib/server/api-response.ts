import { NextResponse } from "next/server";

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function jsonError(message: string, status = 400, code?: string) {
  return NextResponse.json(
    {
      error: {
        message,
        code: code ?? "bad_request",
      },
    },
    { status },
  );
}

export function handleApiError(error: unknown) {
  if (error instanceof Error) {
    if (error.message === "unauthorized") {
      return jsonError("Unauthorized", 401, "unauthorized");
    }

    if (error.message === "not-found") {
      return jsonError("Not found", 404, "not_found");
    }

    if (error.message === "active-theme") {
      return jsonError("Cannot delete the active theme", 409, "active_theme");
    }

    if (error.message === "duplicate") {
      return jsonError("Duplicate slug or name", 409, "duplicate");
    }

    if (error.message === "validation") {
      return jsonError("Validation failed", 422, "validation");
    }

    if (error.message === "in-use") {
      return jsonError("Resource is referenced by one or more themes", 409, "in_use");
    }
  }

  return jsonError("Internal server error", 500, "internal");
}
