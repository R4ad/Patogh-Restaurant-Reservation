# Professional Multi-Stage Dockerfile for Patogh API (.NET 8)
# Build context MUST be the solution root (the folder containing src/)

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# ── Layer caching: copy only csproj files first ──────────────────────────────
COPY ["src/Patogh.Domain/Patogh.Domain.csproj", "src/Patogh.Domain/"]
COPY ["src/Patogh.Application/Patogh.Application.csproj", "src/Patogh.Application/"]
COPY ["src/Patogh.Infrastructure/Patogh.Infrastructure.csproj", "src/Patogh.Infrastructure/"]
COPY ["src/Patogh.Persistance/Patogh.Persistance.csproj", "src/Patogh.Persistance/"]
COPY ["src/Patogh.API/Patogh.API.csproj", "src/Patogh.API/"]

RUN dotnet restore "src/Patogh.API/Patogh.API.csproj"

# ── Copy everything else (source code, etc.) ─────────────────────────────────
COPY . .

WORKDIR /src/src/Patogh.API
RUN dotnet publish "Patogh.API.csproj" -c Release -o /app/publish --no-restore

# ════════════════════════════════════════════════════════════════════════════
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app

RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

RUN addgroup --system --gid 1001 appgroup && \
    adduser --system --uid 1001 --ingroup appgroup appuser

RUN mkdir -p /app/Uploads /app/logs && chown -R appuser:appgroup /app

COPY --from=build /app/publish .

USER appuser

ENV ASPNETCORE_URLS=http://+:8080
ENV ASPNETCORE_ENVIRONMENT=Production

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/health/live || exit 1

ENTRYPOINT ["dotnet", "Patogh.API.dll"]