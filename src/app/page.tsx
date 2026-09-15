import OrderForm from '@/components/OrderForm';
import SqueezeCarouselDemo from '@/components/SqueezeCarouselDemo';

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <div className="py-12">
        <SqueezeCarouselDemo />
      </div>
      <div className="py-12 border-t">
        <OrderForm />
      </div>
    </main>
  );
}
