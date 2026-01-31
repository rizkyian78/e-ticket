
export function Layout({ children }: { children: React.ReactNode }) {
    return (
      <div className="min-h-screen w-full bg-[#f8f7f4]">
        <div className="max-w-7xl mx-auto px-6 py-10">
          {children}
        </div>
      </div>
    );
  }
  
