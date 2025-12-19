import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/auth');
  }

  // TODO: Implement actual Role-Based Access Control (RBAC) here
  // For now, we are just securing that a user exists.
  // In the future, check `user.user_metadata.role` or a `roles` table.
  // const isTeacher = user.user_metadata.role === 'teacher';

  /*
  if (!isTeacher) {
    return (
       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
         <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-8 text-center">
           <h2 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h2>
           <p className="text-gray-600 dark:text-gray-300 mb-4">
             You need teacher privileges to access this page.
           </p>
         </div>
       </div>
    )
  }
  */

  // Fetch real problems from Supabase (placeholder until table exists)
  // const { data: problems } = await supabase.from('problems').select('*');
  const problems: any[] = []; // Temporary empty array until db is populated

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              Teacher Admin Panel
            </h1>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">{user.email}</span>
              <form action="/auth/signout" method="post">
                {/* Sign out should be handled by an API route or Client Component */}
                <a href="/" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white">
                  ← Back to Home
                </a>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Section: Feature Problems */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Featured Problems Management
            </h2>
            <button
              //   onClick={() => router.push('/problems/new')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
            >
              + Upload New Problem
            </button>
          </div>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Feature problems to highlight them on the homepage. Featured problems appear at the top for all students.
          </p>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            {problems.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No problems found in the database.
              </div>
            ) : (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Problem
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      AI Verified
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Featured
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {problems.map((problem) => (
                    <tr key={problem.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-6 py-4">
                        <div>
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {problem.title}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                            {problem.body}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs rounded ${problem.status === 'SOLVED'
                            ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            : problem.status === 'IN_PROGRESS'
                              ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                              : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                            }`}
                        >
                          {problem.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {problem.aiVerified ? (
                          <span className="text-green-500 text-xl" title="AI Verified">
                            ⭐
                          </span>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {problem.featured ? (
                          <span className="text-blue-600 dark:text-blue-400 font-semibold">
                            ✓ Featured
                          </span>
                        ) : (
                          <span className="text-gray-400">Not featured</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {/* 
                         Buttons would need to become Client Components or Server Actions 
                         since we are now in a Server Component 
                         */}
                        <span className="text-gray-400 italic">Actions disabled (Server Component)</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>

        {/* Quick Stats */}
        <section className="grid gap-6 md:grid-cols-3">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Total Problems
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {problems.length}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Featured
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {problems.filter((p) => p.featured).length}
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              AI Verified
            </h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
              {problems.filter((p) => p.aiVerified).length}
            </p>
          </div>
        </section>
      </main>
    </div>
  );
}
