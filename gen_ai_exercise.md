# Prompt

Help me create an API for a task management web app using the following tech stack:

- Ruby on Rails 8 in api only mode
- Devise for authentication in api mode
- Swagger for API documentation
- Docker for deployment
- rspec tests for models, controllers, and any other supporting code

The system should support the following functionality:

- Create, read, update, and delete tasks (CRUD)
- Each task has a title, description, status, and due_date
- Tasks are associated with a user (assume basic User model exists)

Be succinct in your output and focus on providing me guidelines to perform the next objective directly.
Follow best practices for code organization and application security.
Avoid creating complex logic when simpler implementation would suffice, but provide notes about implementation
parts that should be paid attention to when the app is scaled up.

Start with the first step of setting up my environment, then proceed to the next step only when I say so.
When asked to rewrite some code, avoid rewriting parts of it not related to the ask.
Let's begin.

# Output validation

Given I have done these steps multiple time throughout my career, I know 80% of what I should get as an output.

Therefore, most of my validation will look similar to how I would review a colleague's PR.

I will question decisions I find strange, overly complicated, don't make sense, are unexpected, or out-of-place.
For each of those, I will guide the tool in the direction I expected it to go and see if it can give me a 
good explanation regarding continuing, or not, in my suggested path.

If we're talking about a scenario that's new to me, I will quickly research documentation and other people's opinions about it.
Then, come back with more questions to the tool.

Once I'm satisfied, we'll continue to the next step. Rinse and repeat.

