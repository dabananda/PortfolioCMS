type Project = {
  id: string;
  title: string;
  shortDescription: string;
  technologies: string[];
};

async function getProjects(): Promise<Project[]> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/project`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    console.log('Failed to fetch projects');
    return [];
  }

  const json = await response.json();

  return json.data || json;
}

export default async function Homepage() {
  const projects = await getProjects();
  return (
    <div className='max-w-4xl mx-auto space-y-8'>
      <h1 className='text-4xl font-extrabold tracking-tight'>
        Hello, I am a Fullstack Developer 👋
      </h1>
      <p className='text-lg text-slate-600'>
        I build fast, secure, and beautiful web applications using .NET and Next.js.
      </p>
      <section className='pt-8'>
        <h2 className='text-2xl font-bold mb-4'>My Latest Projects</h2>

        {projects.length === 0 ? (
          <p className='text-slate-500 italic'>No projects found. Is the .NET server running?</p>
        ) : (
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {projects.map((project) => (
              <div
                key={project.id}
                className='p-6 bg-white rounded-xl shadow-sm border border-slate-200'
              >
                <h3 className='font-bold text-lg'>{project.title}</h3>
                <p className='text-slate-600 mt-2'>{project.shortDescription}</p>
                {project.technologies && (
                  <div className='flex flex-wrap gap-2 mt-4'>
                    {project.technologies.map((tech) => (
                      <span
                        key={tech}
                        className='px-2 py-1 bg-slate-100 text-xs rounded-md'
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
