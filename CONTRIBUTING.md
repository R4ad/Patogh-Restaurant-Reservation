# Contributing to Patogh

Thank you for your interest in contributing to this project.

## Getting Started

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes
4. Commit using [Conventional Commits](#commit-style)
5. Push and open a Pull Request

## Branching Strategy

| Branch pattern | Purpose |
|---|---|
| `main` | Stable, deployable code |
| `develop` | Integration branch |
| `feature/<name>` | New features |
| `fix/<name>` | Bug fixes |
| `docs/<name>` | Documentation only |

## Commit Style

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add table availability check endpoint
fix: correct BCrypt hash comparison in DataSeeder
docs: update API endpoint documentation
refactor: extract reservation validation into FluentValidation rule
test: add unit tests for ReservationService
chore: update .NET SDK to 8.0.x
```

## Security Rules

**Never commit secrets or real credentials.**

- Do not commit `.env` files — only `.env.example` with placeholder values
- Do not hardcode passwords, API keys, or JWT secrets in source code
- Do not commit database dumps containing real user data
- Review `appsettings.json` changes carefully — connection strings must use placeholders

If you find a security issue, please report it privately rather than opening a public issue.

## Code Style

**Frontend:**
- Follow the existing ESLint + Prettier configuration
- Use TypeScript strict mode — avoid `any`
- Component filenames: `PascalCase.tsx`

**Backend:**
- Follow the Clean Architecture layer boundaries (Domain → Application → Infrastructure → API)
- Use CQRS pattern: one Command/Query per use case
- All public handlers must have a FluentValidation validator
- Use `async/await` throughout; no `.Result` or `.Wait()` on Tasks

## Pull Request Checklist

- [ ] No real secrets in any file
- [ ] TypeScript compiles without errors (`npm run build` in `front/`)
- [ ] .NET project builds without warnings (`dotnet build` in `back/patogh/`)
- [ ] Docker Compose config is valid (`docker compose config` in `back/patogh/`)
- [ ] `back/patogh/.env.example` updated if new env vars added
- [ ] `front/.env.example` updated if new frontend env vars added
- [ ] `docs/API.md` updated for new/changed endpoints
