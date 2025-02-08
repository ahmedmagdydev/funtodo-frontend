# Scratchpad

## Instructions

During you interaction with the user, if you find anything reusable in this project (e.g. version of a library, model name), especially about a fix to a mistake you made or a correction you received, you should take note in the `Lessons` section in the `scratchpad.md` file so you will not make the same mistake again.

You should also use the `scratchpad.md` file as a scratchpad to organize your thoughts. Especially when you receive a new task, you should first review the content of the scratchpad, clear old different task if necessary, first explain the task, and plan the steps you need to take to complete the task. You can use todo markers to indicate the progress, e.g.
[X] Task 1
[ ] Task 2
Also update the progress of the task in the Scratchpad when you finish a subtask.
Especially when you finished a milestone, it will help to improve your depth of task accomplishment to use the scratchpad to reflect and plan.
The goal is to help you maintain a big picture as well as the progress of the task. Always refer to the Scratchpad when you plan the next step.

## User Specified Lessons

- Include info useful for debugging in the program output.
- Read the file before you try to edit it.
- Use LLM to perform flexible text understanding tasks. First test on a few files. After success, make it parallel.

## Lessons Learned

- Use `jwt-decode` to decode JWT tokens in the frontend.
- When using MUI's `sx` prop with multiple style objects in TypeScript, use a theme callback and type assertions:
  ```tsx
  sx={(theme) => ({
    ...(style1 as any),
    ...(style2 as any)
  })}
  ```
  This ensures proper type compatibility while allowing style composition.

## Reusable Information

- Library: `jwt-decode`
