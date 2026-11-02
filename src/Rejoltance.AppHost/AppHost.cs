// Local orchestration: one command (`aspire run` or `dotnet run --project src/Rejoltance.AppHost`) starts everything.
// No Docker needed: the database is a SQLite file. PostgreSQL arrives as a container in Sprint 4 (ADR-0007):
//   var db = builder.AddPostgres("pg").AddDatabase("rejoltance");  server.WithReference(db).WaitFor(db);
var builder = DistributedApplication.CreateBuilder(args);

var dataDir = Path.GetFullPath(Path.Combine(builder.AppHostDirectory, "..", "..", ".data"));
Directory.CreateDirectory(dataDir);

var server = builder.AddProject<Projects.Rejoltance_Server>("server")
    .WithEnvironment("ConnectionStrings__rejoltance", $"Data Source={Path.Combine(dataDir, "rejoltance.db")}")
    // Health check over plain HTTP: works on machines/CI runners where the dev HTTPS certificate is not trusted.
    .WithHttpHealthCheck("/health", endpointName: "http")
    .WithExternalHttpEndpoints();

var web = builder.AddViteApp("web", "../web")
    .WithReference(server)
    .WaitFor(server);

server.PublishWithContainerFiles(web, "wwwroot");

builder.Build().Run();
