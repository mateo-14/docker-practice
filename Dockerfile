FROM mcr.microsoft.com/dotnet/sdk:7.0 as build
WORKDIR /src

COPY src/*.csproj .
RUN dotnet restore

COPY src .
RUN dotnet publish -c Release -o /publish

FROM mcr.microsoft.com/dotnet/aspnet:7.0 as runtime
WORKDIR /publish
COPY --from=build /publish .
EXPOSE 80
ENTRYPOINT ["dotnet", "asp-app.dll"]