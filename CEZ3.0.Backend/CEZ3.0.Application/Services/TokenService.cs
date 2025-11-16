using CEZ3._0.Application.Interfaces;
using CEZ3._0.Domain.Entities;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace CEZ3._0.Application.Services
{
    public class TokenService(IConfiguration config) : ITokenService
    {
        public readonly SymmetricSecurityKey _key = new(Encoding.UTF8.GetBytes(config["TOKEN_KEY"] ?? throw new Exception("token key was not found")));

        public string CreateToken(User user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
                new Claim(JwtRegisteredClaimNames.Email, user.Email!),
            };

            //foreach (var role in user.Role)
            //{
                claims.Add(new Claim(ClaimTypes.Role, user.Role));
            //}

            var creds = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.Now.AddDays(7),
                SigningCredentials = creds
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}