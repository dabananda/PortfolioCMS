using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.DTOs.Skill;
using PortfolioCMS.Server.Application.Extensions;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Application.Mappings;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class SkillService : ISkillService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public SkillService(ApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<IReadOnlyList<SkillResponse>> GetAllAsync()
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var skills = await _context.Skills
                .AsNoTracking()
                .Where(s => s.UserId == userId)
                .OrderBy(s => s.Category)
                .ThenBy(s => s.SkillName)
                .ToListAsync();

            return SkillMapper.ToResponseList(skills);
        }

        public async Task<SkillResponse> GetByIdAsync(Guid id)
        {
            var entity = await FindOwnedSkillAsync(id);
            return SkillMapper.ToResponse(entity);
        }

        public async Task<SkillResponse> CreateAsync(CreateSkillRequest request)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var duplicate = await _context.Skills
                .AnyAsync(s => s.UserId == userId && s.SkillName == request.SkillName.Trim());

            if (duplicate)
                throw new AppConflictException($"Skill '{request.SkillName}' already exists.");

            var entity = SkillMapper.ToEntity(request, userId);

            await _context.Skills.AddAsync(entity);
            await _context.SaveChangesAsync();

            return SkillMapper.ToResponse(entity);
        }

        public async Task<SkillResponse> UpdateAsync(Guid id, UpdateSkillRequest request)
        {
            var entity = await FindOwnedSkillAsync(id);
            var userId = _currentUserService.GetUserIdOrThrow();

            var duplicate = await _context.Skills
                .AnyAsync(s => s.UserId == userId && s.SkillName == request.SkillName.Trim() && s.Id != id);

            if (duplicate)
                throw new AppConflictException($"Skill '{request.SkillName}' already exists.");

            SkillMapper.ApplyUpdate(request, entity);
            await _context.SaveChangesAsync();

            return SkillMapper.ToResponse(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await FindOwnedSkillAsync(id);
            entity.IsDeleted = true;
            await _context.SaveChangesAsync();
        }

        private async Task<Skill> FindOwnedSkillAsync(Guid id)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            return await _context.Skills
                .FirstOrDefaultAsync(s => s.Id == id && s.UserId == userId)
                ?? throw new AppNotFoundException($"Skill with ID '{id}' was not found.");
        }
    }
}
