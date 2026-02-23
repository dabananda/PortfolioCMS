export default function DashboardPage() {
  return (
    <div>
      <h1 className='text-3xl font-bold text-slate-800 mb-6'>Welcome to your Dashboard</h1>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
        {/* Stat Cards */}
        <div className='bg-white p-6 rounded-xl shadow-sm border border-slate-200'>
          <h3 className='text-slate-500 font-medium'>Total Projects</h3>
          <p className='text-3xl font-bold mt-2'>12</p>
        </div>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-slate-200'>
          <h3 className='text-slate-500 font-medium'>Blog Posts</h3>
          <p className='text-3xl font-bold mt-2'>5</p>
        </div>
        <div className='bg-white p-6 rounded-xl shadow-sm border border-slate-200'>
          <h3 className='text-slate-500 font-medium'>Messages</h3>
          <p className='text-3xl font-bold mt-2 text-blue-600'>3 New</p>
        </div>
      </div>
    </div>
  );
}
