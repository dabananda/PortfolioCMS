using PortfolioCMS.Server.Application.DTOs.ProblemSolving;
using PortfolioCMS.Server.Domain.Entities;

namespace PortfolioCMS.Server.Application.Mappings
{
    public static class ProblemSolvingMapper
    {
        public static ProblemSolvingResponse ToResponse(ProblemSolving entity)
        {
            ArgumentNullException.ThrowIfNull(entity);

            return new ProblemSolvingResponse
            {
                Id = entity.Id,
                JudgeName = entity.JudgeName,
                TotalSolved = entity.TotalSolved,
                Rank = entity.Rank,
                Handle = entity.Handle,
                ProfileUrl = entity.ProfileUrl,
                UserId = entity.UserId,
                CreatedAt = entity.CreatedAt,
                UpdatedAt = entity.UpdatedAt
            };
        }

        public static IReadOnlyList<ProblemSolvingResponse> ToResponseList(IEnumerable<ProblemSolving> entities)
        {
            ArgumentNullException.ThrowIfNull(entities);
            return entities.Select(ToResponse).ToList().AsReadOnly();
        }

        public static ProblemSolving ToEntity(CreateProblemSolvingRequest request, Guid userId)
        {
            ArgumentNullException.ThrowIfNull(request);

            return new ProblemSolving
            {
                JudgeName = request.JudgeName.Trim(),
                TotalSolved = request.TotalSolved,
                Rank = request.Rank?.Trim(),
                Handle = request.Handle?.Trim(),
                ProfileUrl = request.ProfileUrl.Trim(),
                UserId = userId
            };
        }

        public static void ApplyUpdate(UpdateProblemSolvingRequest request, ProblemSolving entity)
        {
            ArgumentNullException.ThrowIfNull(request);
            ArgumentNullException.ThrowIfNull(entity);

            entity.JudgeName = request.JudgeName.Trim();
            entity.TotalSolved = request.TotalSolved;
            entity.Rank = request.Rank?.Trim();
            entity.Handle = request.Handle?.Trim();
            entity.ProfileUrl = request.ProfileUrl.Trim();
        }
    }
}
