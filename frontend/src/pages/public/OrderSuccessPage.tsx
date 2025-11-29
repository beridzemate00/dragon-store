import { Link, useParams } from "react-router-dom";
import MainNavbar from "../../components/layout/MainNavbar";
import MainFooter from "../../components/layout/MainFooter";

const OrderSuccessPage = () => {
  const { orderId } = useParams();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <MainNavbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow-md px-6 py-5 text-center max-w-md">
          <h1 className="text-2xl font-semibold mb-2">Thank you!</h1>
          <p className="text-sm text-slate-600 mb-3">
            Your order has been created.
          </p>
          {orderId && (
            <p className="text-xs text-slate-500 mb-3">
              Order ID: <span className="font-mono">{orderId}</span>
            </p>
          )}
          <Link
            to="/"
            className="inline-block mt-2 bg-red-500 text-white rounded-full px-5 py-2 text-sm font-semibold"
          >
            Back to home
          </Link>
        </div>
      </main>
      <MainFooter />
    </div>
  );
};

export default OrderSuccessPage;
