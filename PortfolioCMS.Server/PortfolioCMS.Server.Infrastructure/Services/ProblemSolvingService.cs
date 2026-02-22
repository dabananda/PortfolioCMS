using Microsoft.EntityFrameworkCore;
using PortfolioCMS.Server.Application.DTOs.ProblemSolving;
using PortfolioCMS.Server.Application.Extensions;
using PortfolioCMS.Server.Application.Interfaces;
using PortfolioCMS.Server.Application.Mappings;
using PortfolioCMS.Server.Domain.Common;
using PortfolioCMS.Server.Domain.Entities;
using PortfolioCMS.Server.Infrastructure.Data;

namespace PortfolioCMS.Server.Infrastructure.Services
{
    public class ProblemSolvingService : IProblemSolvingService
    {
        private readonly ApplicationDbContext _context;
        private readonly ICurrentUserService _currentUserService;

        public ProblemSolvingService(ApplicationDbContext context, ICurrentUserService currentUserService)
        {
            _context = context;
            _currentUserService = currentUserService;
        }

        public async Task<IReadOnlyList<ProblemSolvingResponse>> GetAllAsync()
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var records = await _context.ProblemSolvings
                .AsNoTracking()
                .Where(p => p.UserId == userId)
                .OrderBy(p => p.JudgeName)
                .ToListAsync();

            return ProblemSolvingMapper.ToResponseList(records);
        }

        public async Task<ProblemSolvingResponse> GetByIdAsync(Guid id)
        {
            var entity = await FindOwnedRecordAsync(id);
            return ProblemSolvingMapper.ToResponse(entity);
        }

        public async Task<ProblemSolvingResponse> CreateAsync(CreateProblemSolvingRequest request)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            var duplicate = await _context.ProblemSolvings
                .AnyAsync(p => p.UserId == userId && p.JudgeName == request.JudgeName.Trim());

            if (duplicate)
                throw new AppConflictException($"A record for judge '{request.JudgeName}' already exists.");

            var entity = ProblemSolvingMapper.ToEntity(request, userId);

            await _context.ProblemSolvings.AddAsync(entity);
            await _context.SaveChangesAsync();

            return ProblemSolvingMapper.ToResponse(entity);
        }

        public async Task<ProblemSolvingResponse> UpdateAsync(Guid id, UpdateProblemSolvingRequest request)
        {
            var entity = await FindOwnedRecordAsync(id);
            var userId = _currentUserService.GetUserIdOrThrow();

            var duplicate = await _context.ProblemSolvings
                .AnyAsync(p => p.UserId == userId && p.JudgeName == request.JudgeName.Trim() && p.Id != id);

            if (duplicate)
                throw new AppConflictException($"A record for judge '{request.JudgeName}' already exists.");

            ProblemSolvingMapper.ApplyUpdate(request, entity);
            await _context.SaveChangesAsync();

            return ProblemSolvingMapper.ToResponse(entity);
        }

        public async Task DeleteAsync(Guid id)
        {
            var entity = await FindOwnedRecordAsync(id);
            entity.IsDeleted = true;
            await _context.SaveChangesAsync();
        }

        private async Task<ProblemSolving> FindOwnedRecordAsync(Guid id)
        {
            var userId = _currentUserService.GetUserIdOrThrow();

            return await _context.ProblemSolvings
                .FirstOrDefaultAsync(p => p.Id == id && p.UserId == userId)
                ?? throw new AppNotFoundException($"Problem solving record with ID '{id}' was not found.");
        }
    }
}
