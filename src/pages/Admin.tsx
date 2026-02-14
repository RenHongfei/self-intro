import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Section } from '@/types';
import { Plus, LogOut, LayoutGrid, List } from 'lucide-react';

export default function Admin() {
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUser();
    fetchSections();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/login');
    }
  };

  const fetchSections = async () => {
    try {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .order('order_index', { ascending: true });

      if (error) throw error;
      setSections(data || []);
    } catch (error) {
      console.error('Error fetching sections:', error);
      // Fallback to empty if table doesn't exist yet
      setSections([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-xl">
        <div className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <LayoutGrid className="w-6 h-6 text-blue-500" />
            <span className="font-bold text-lg">Admin Dashboard</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 text-zinc-400 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Content Sections</h1>
          <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg transition-colors">
            <Plus className="w-4 h-4" />
            <span>Add Section</span>
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-zinc-500">Loading...</div>
        ) : sections.length === 0 ? (
          <div className="text-center py-20 border border-dashed border-white/10 rounded-2xl bg-white/5">
            <List className="w-12 h-12 mx-auto text-zinc-600 mb-4" />
            <p className="text-zinc-400">No sections found. Start by adding one.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className="p-4 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-between"
              >
                <div>
                  <h3 className="font-medium">{section.title}</h3>
                  <span className="text-xs text-zinc-500 uppercase tracking-wider">{section.type}</span>
                </div>
                <div className="flex space-x-2">
                  <button className="text-sm px-3 py-1 bg-white/5 hover:bg-white/10 rounded transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
