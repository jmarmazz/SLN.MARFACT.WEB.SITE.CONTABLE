
using MARFACT.QUERY.DTOs;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore; 

namespace MARFACT.QUERY.SQLSERVER.Models
{
    public sealed partial class QueryContext
    {
        internal LoginQueryDto ConsultarLogin(string Usuario, string ClaveEncriptada)
        {
            var param = new List<SqlParameter>();
            param.Add(new SqlParameter("@p" + param.Count, Usuario));
            param.Add(new SqlParameter("@p" + param.Count, ClaveEncriptada));
            var commandText = "QRY_Login ";
            for (var i = 0; i < param.Count; i++) commandText += $"@p{i},"; commandText = commandText.Remove(commandText.Length - 1);
            return LoginQueryDto.FromSqlRaw(commandText, param.ToArray()).ToList().FirstOrDefault();
        }
    }
}
