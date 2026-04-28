# Remote Frontend Code Exercise

Hello there 👋

If you're reading this, it means you're now at the coding exercise step of our engineering hiring process, woot woot.  
We're really happy that you made it here and super appreciative of your time!

In this exercise you're asked to complete a feature in an existing React app.

If you have any questions, don't hesitate to reach out directly to [code_exercise@remote.com](mailto:code_exercise@remote.com).

## About the challenge

This app shows a list of team members. Someone else started it, but they had an unexpected family emergency. You'll need to take it over and ship it!

The design specs are in the Figma file shared with you by e-mail.

Some requirements are not explicit. That's on purpose.  
We believe an engineer is more than a coder, it's a thinker too! ✨ We care about both high-quality code and delightful user experiences. Show us the Product Engineer inside you! You'll need to:

- Finish the "People" page.
- Bonus: Add a new small feature of your choice to the app.

## Expectations

**It should be production-ready code.**
Your code will show us what you care about and how you ship things to production. It's a mirror of your craft.

**You can use extra tools to accomplish this task.**
There's no need to reinvent the wheel. In fact, be mindful or your code changes to make our review easier too. Think twice before re-writing the entire codebase.

**Walk us through your solution.**
Record a video walkthrough of your code. More details in the [Video guidelines](#video-guidelines) section.

**Be mindful or your own time.**
You have a life besides this and we respect that. If you left out stuff, mention it too.

### 🏁 When you're done

1. Open a PR with your solution.
2. Record a video with a walkthrough of your solution.
3. Let us know your feedback about this exercise. We appreciate any feedback from you.

### Video guidelines:

- The video shouldn't be longer than 5-10 minutes.
- Tell us about your fetching solution.
- If you used AI, tell us how.
- Anything else you'd like to share.

Send us the PR link and the video to [code_exercise@remote.com](mailto:code_exercise@remote.com).

---

## The project

### Getting started

The required node.js and NPM versions are defined at the `package.json` file.

1. Clone the repo repository
2. Install the dependencies with `npm install` - this generates the mocked server too.
3. Start the app with `npm run dev`

### Stack

- React with TypeScript
- Styled Components

Once again, you can modify the codebase. You can re-organize it, introduce new patterns, or add new necessary tools, as long the main stack remains the same.
We're interested in how you write a React app with Styled-Components.

### API

We use [json-server v0](https://github.com/typicode/json-server/tree/v0.17.4) to mock the API. The main endpoint is:

- `GET http://localhost:4002/people`: get the full list of people

Check its docs for more details on how to use it, including query parameters for search, filter and pagination operations.
