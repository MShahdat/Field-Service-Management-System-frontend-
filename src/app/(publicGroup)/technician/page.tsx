const TechnicianPage = () => {
  return (
    <div className="max-w-11/12 mx-auto px-4 py-4">
      <div className="w-full flex gap-3">
        <div className="min-w-1/4 hidden sm:block bg-red-600">
          left part
        </div>
        <div className="w-3/4 bg-green-600">
          right part
        </div>
      </div>
    </div>
  );
};

export default TechnicianPage;
