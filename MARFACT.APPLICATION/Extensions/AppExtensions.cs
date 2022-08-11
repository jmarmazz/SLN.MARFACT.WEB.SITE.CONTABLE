using AutoMapper;
using MARFACT.APPLICATION.DTOs;
using MARFACT.QUERY.DTOs;

namespace MARFACT.APPLICATION.Extensions
{
    public static class AppExtensions
    {
        internal static List<IdAppDto> MapToIdAppDto(this List<IdQueryDto> obj)
        {
            var configuration = new MapperConfiguration(cfg => cfg.CreateMap<IdQueryDto, IdAppDto>());
            var mapper = configuration.CreateMapper();
            return mapper.Map<List<IdAppDto>>(obj);
        }
        
        internal static LoginAppResultDto MapToLoginAppDto(this LoginQueryDto obj)
        {
            var configuration = new MapperConfiguration(cfg => cfg.CreateMap<LoginQueryDto, LoginAppResultDto>());
            var mapper = configuration.CreateMapper();
            return mapper.Map<LoginAppResultDto>(obj);
        }
    }
}
