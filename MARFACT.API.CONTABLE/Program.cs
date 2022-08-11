
using Microsoft.EntityFrameworkCore;
using MARFACT.QUERY.SQLSERVER.Models;
using MARFACT.INFRA.REPOSITORY.SQLSERVER.Models;
using MARFACT.QUERY.SQLSERVER.QueryServices;
using MARFACT.QUERY.Interfaces.QueryServices;
using MARFACT.APPLICATION;
using MARFACT.APPLICATION.Interfaces;

var builder = WebApplication.CreateBuilder(args); 
// Add services to the container.

builder.Services.AddControllers();

builder.Services.AddScoped<ILoginQueryService, LoginQueryService>();
builder.Services.AddScoped<ILoginAppService, LoginAppService>(); 

var CadenaConexionRead = builder.Configuration.GetSection("DBRead").GetSection("DataSource").Value;
var CadenaConexionWrite = builder.Configuration.GetSection("DBWrite").GetSection("DataSource").Value;
builder.Services.AddDbContext<QueryContext>(options => options.UseSqlServer(CadenaConexionRead));
builder.Services.AddDbContext<CmdContext>(options => options.UseSqlServer(CadenaConexionWrite));

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();
app.Run();


