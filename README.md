# Blazedash

Blazedash is a dashboard for monitoring your Cloudflare account. It provides analytics and insights for your domains, including:

- Traffic analytics and bandwidth usage
- Support for multiple zones/domains
- Date range filtering with month/year selection
- CSV export capabilities
- Built with Remix and deployed on Cloudflare Pages

The dashboard uses the Cloudflare API to fetch real-time data about your domains and presents it in an easy-to-use interface. It's designed to be secure, performant, and developer-friendly with TypeScript support throughout.

## Deployment

### Cloudflare Pages
You can fork this repo and use Cloudflare Pages CI to deploy your own project.

### Wrangler
You can also use Wrangler to deploy this app.

```sh
npm run build
npm run deploy
```

## API Token
- You can configure the API token through environment variables or the settings interface. For production deployments, it's best practice to use environment variables for better security and easier token management. 
- Additionally, implementing Cloudflare Access is advised in production to enhance authentication security.

## Development

Run the dev server:

```sh
npm run dev
```

To run Wrangler:

```sh
npm run build
npm run start
```

### Typegen

Generate types for your Cloudflare bindings in `wrangler.toml`:

```sh
npm run typegen
```

You will need to rerun typegen whenever you make changes to `wrangler.toml`.


### Notes

#### Loader and Action
- Return object with promise { data: Promise<T> } in the loader if you need to use Suspense and Await
- For actions, use new Response() or Response.json() instead of json() since it's deprecated

#### Styling
- Use Tailwind CSS for styling
- Use the `clsx` library for conditional classes
- Use the `twMerge` function for merging Tailwind classes
