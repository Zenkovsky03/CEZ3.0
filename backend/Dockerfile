FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# Copy the solution file
COPY ["CEZ3.0.sln", "./"]

# Copy project files
COPY ["CEZ3.0.Api/CEZ3.0.Api.csproj", "CEZ3.0.Api/"]
COPY ["CEZ3.0.Application/CEZ3.0.Application.csproj", "CEZ3.0.Application/"]
COPY ["CEZ3.0.Domain/CEZ3.0.Domain.csproj", "CEZ3.0.Domain/"]
COPY ["CEZ3.0.Infrastructure/CEZ3.0.Infrastructure.csproj", "CEZ3.0.Infrastructure/"]

# Restore dependencies
RUN dotnet restore "CEZ3.0.Api/CEZ3.0.Api.csproj"

# Copy source code
COPY . .

# Build and Publish
WORKDIR "/src/CEZ3.0.Api"
RUN dotnet build "CEZ3.0.Api.csproj" -c Release -o /app/build
FROM build AS publish
RUN dotnet publish "CEZ3.0.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "CEZ3.0.Api.dll"]