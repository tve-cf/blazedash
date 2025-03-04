# Development

## Codes

#### Loader and Action

- Return object with promise { data: Promise<T> } in the loader if you need to use Suspense and Await
- For actions, use new Response() or Response.json() instead of json() since it's deprecated

### Styling

- Use Tailwind CSS for styling
- Use the `clsx` library for conditional classes
- Use the `twMerge` function for merging Tailwind classes
