import type { Certification } from '../../types/portfolio';

interface CertificationsSectionProps {
  certifications: Certification[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

export default function CertificationsSection({ certifications }: CertificationsSectionProps) {
  if (!certifications.length) return null;

  return (
    <section className="py-20 relative overflow-hidden">
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 w-96 h-48 opacity-10 pointer-events-none"
        style={{ background: '#3b2bee', filter: 'blur(80px)' }}
      />

      <div className="max-w-7xl mx-auto px-4 md:px-10">
        <div className="text-center mb-16">
          <div className="section-badge mb-4 mx-auto">
            <span className="material-symbols-outlined text-[14px]">verified</span>
            Credentials
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white">
            Certifications
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {certifications.map((cert) => (
            <div key={cert.id} className="card-dark p-5 group hover:-translate-y-1 transition-transform">
              <div className="flex items-start gap-4">
                <div
                  className="size-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: 'rgba(59,43,238,0.15)', color: '#7c6fff' }}
                >
                  <span className="material-symbols-outlined text-[24px]">verified</span>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-display font-bold text-white text-sm leading-tight group-hover:text-[#7c6fff] transition-colors">
                    {cert.certificationName}
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">{cert.issuingOrganization}</p>
                  <p className="text-slate-500 text-xs mt-1">{formatDate(cert.dateObtained)}</p>

                  {cert.credentialId && (
                    <p className="text-slate-600 text-xs mt-1 font-mono truncate">
                      ID: {cert.credentialId}
                    </p>
                  )}

                  {cert.certificateUrl && (
                    <a
                      href={cert.certificateUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-[#7c6fff] text-xs font-bold mt-3 hover:text-white transition-colors"
                    >
                      View Certificate
                      <span className="material-symbols-outlined text-[13px]">open_in_new</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
