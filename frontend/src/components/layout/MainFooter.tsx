const MainFooter = () => {
  return (
    <footer className="border-t bg-white text-sm text-slate-500">
      <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between">
        <span>© {new Date().getFullYear()} Dragon Store</span>
        <span>Batumi</span>
      </div>
    </footer>
  );
};

export default MainFooter;
