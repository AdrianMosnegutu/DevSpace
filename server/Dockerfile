# Stage 1: Build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copy everything and restore
COPY . . 
RUN dotnet restore "./Server.csproj"

# Build and publish to /app
RUN dotnet publish "./Server.csproj" -c Release -o /app --no-restore

# Stage 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app

# Optional: Use a non-root user for better security
RUN adduser --disabled-password --gecos "" appuser
USER appuser

# Copy published output from build stage
COPY --from=build /app .

# Expose the port Render expects (default: 10000, but 8080 is also fine)
EXPOSE 8080

# Run the app
ENTRYPOINT ["dotnet", "Server.dll"]
