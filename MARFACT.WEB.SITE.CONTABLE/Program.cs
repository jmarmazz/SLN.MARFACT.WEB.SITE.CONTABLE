using MARFACT.APPLICATION;
using MARFACT.APPLICATION.Interfaces;
using MARFACT.INFRA.REPOSITORY.SQLSERVER.Models;
using MARFACT.QUERY.Interfaces.QueryServices;
using MARFACT.QUERY.SQLSERVER.Models;
using MARFACT.QUERY.SQLSERVER.QueryServices;
using MARFACT.WEB.SITE.CONTABLE;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews().AddRazorRuntimeCompilation();

builder.Services.AddScoped<ILoginQueryService, LoginQueryService>();
builder.Services.AddScoped<ILoginAppService, LoginAppService>();

var CadenaConexionRead = builder.Configuration.GetSection("DBRead").GetSection("DataSource").Value;
var CadenaConexionWrite = builder.Configuration.GetSection("DBWrite").GetSection("DataSource").Value;
builder.Services.AddDbContext<QueryContext>(options => options.UseSqlServer(CadenaConexionRead));
builder.Services.AddDbContext<CmdContext>(options => options.UseSqlServer(CadenaConexionWrite));

var app = builder.Build();  

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Login}/{action=Login}/{id?}");

app.Run();
