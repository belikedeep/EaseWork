# Database Schema Design

## Users

- `id` (ObjectId)
- `name` (string)
- `email` (string, unique)
- `password` (string, hashed)
- `role` (string: "admin", "member", etc.)
- `profile_info` (object: bio, avatar, etc.)

## Projects

- `id` (ObjectId)
- `name` (string)
- `description` (string)
- `ownerId` (ObjectId, references Users)
- `members` (array of ObjectId, references Users)
- `deadlines` (array of date or object: {milestone, date})

## Tasks

- `id` (ObjectId)
- `title` (string)
- `description` (string)
- `status` (string: "todo", "in-progress", "done", etc.)
- `deadline` (date)
- `projectId` (ObjectId, references Projects)
- `assignedTo` (ObjectId, references Users)
- `priority` (string: "low", "medium", "high")

## Teams

- `id` (ObjectId)
- `name` (string)
- `description` (string)
- `ownerId` (ObjectId, references Users)
- `members` (array of ObjectId, references Users)
