import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface Product {
  id: number;
  name: string;
  price: number;
  unit: string;
  category: string;
  image: string;
}

const products: Product[] = [
  { id: 1, name: 'Помидоры', price: 150, unit: 'кг', category: 'Овощи', image: 'https://cdn.poehali.dev/projects/9951cd26-7861-4663-8384-fc67dc910f5f/files/937c3fcf-91f7-496f-a539-44eb2394480d.jpg' },
  { id: 2, name: 'Огурцы', price: 120, unit: 'кг', category: 'Овощи', image: 'https://cdn.poehali.dev/projects/9951cd26-7861-4663-8384-fc67dc910f5f/files/aca58f1b-1f7f-418d-81cc-8bbe4eaea116.jpg' },
  { id: 3, name: 'Помидоры черри', price: 220, unit: 'кг', category: 'Овощи', image: 'https://cdn.poehali.dev/projects/9951cd26-7861-4663-8384-fc67dc910f5f/files/937c3fcf-91f7-496f-a539-44eb2394480d.jpg' },
  { id: 4, name: 'Огурцы маринованные', price: 180, unit: 'кг', category: 'Овощи', image: 'https://cdn.poehali.dev/projects/9951cd26-7861-4663-8384-fc67dc910f5f/files/aca58f1b-1f7f-418d-81cc-8bbe4eaea116.jpg' },
];

export default function Index() {
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [activeTab, setActiveTab] = useState('home');

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const addToCart = (productId: number) => {
    setCart(prev => ({
      ...prev,
      [productId]: (prev[productId] || 0) + 1
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[productId] > 1) {
        newCart[productId]--;
      } else {
        delete newCart[productId];
      }
      return newCart;
    });
  };

  const cartItems = products.filter(p => cart[p.id]);
  const totalPrice = cartItems.reduce((sum, p) => sum + p.price * cart[p.id], 0);
  const cartCount = Object.values(cart).reduce((sum, count) => sum + count, 0);

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">TAKZY17</h1>
          <nav className="hidden md:flex gap-6">
            <button onClick={() => setActiveTab('home')} className="text-sm font-medium hover:text-primary transition-colors">Главная</button>
            <button onClick={() => setActiveTab('catalog')} className="text-sm font-medium hover:text-primary transition-colors">Каталог</button>
            <button onClick={() => setActiveTab('delivery')} className="text-sm font-medium hover:text-primary transition-colors">Доставка</button>
          </nav>
          <button onClick={() => setActiveTab('cart')} className="relative">
            <Icon name="ShoppingCart" size={24} />
            {cartCount > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs">
                {cartCount}
              </Badge>
            )}
          </button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsContent value="home" className="animate-fade-in">
            <section className="py-20 text-center">
              <h2 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">Свежие овощи</h2>
              <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">Качественные помидоры и огурцы с доставкой на дом</p>
              <Button size="lg" onClick={() => setActiveTab('catalog')} className="hover:scale-105 transition-transform">
                Смотреть каталог
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </section>

            <section className="py-12">
              <h3 className="text-3xl font-bold mb-8">Наши продукты</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
                    <div className="aspect-square bg-secondary overflow-hidden">
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    </div>
                    <div className="p-6">
                      <Badge variant="secondary" className="mb-2">{product.category}</Badge>
                      <h4 className="font-semibold text-lg mb-2">{product.name}</h4>
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-bold">{product.price} ₽<span className="text-sm text-muted-foreground">/{product.unit}</span></span>
                        <Button onClick={() => addToCart(product.id)} size="sm" className="hover:scale-105 transition-transform">
                          <Icon name="Plus" size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          </TabsContent>

          <TabsContent value="catalog" className="animate-fade-in">
            <div className="mb-8">
              <h2 className="text-4xl font-bold mb-6">Каталог товаров</h2>
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Поиск товаров..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <Card key={product.id} className="overflow-hidden group hover:shadow-lg transition-shadow animate-scale-in">
                  <div className="aspect-square bg-secondary overflow-hidden">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <div className="p-4">
                    <Badge variant="secondary" className="mb-2 text-xs">{product.category}</Badge>
                    <h4 className="font-semibold mb-2">{product.name}</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-bold">{product.price} ₽<span className="text-sm text-muted-foreground">/{product.unit}</span></span>
                      <Button onClick={() => addToCart(product.id)} size="sm" className="hover:scale-105 transition-transform">
                        <Icon name="Plus" size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-16">
                <Icon name="Search" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground">Товары не найдены</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="cart" className="animate-fade-in">
            <h2 className="text-4xl font-bold mb-8">Корзина</h2>
            
            {cartItems.length === 0 ? (
              <div className="text-center py-16">
                <Icon name="ShoppingCart" size={48} className="mx-auto mb-4 text-muted-foreground" />
                <p className="text-lg text-muted-foreground mb-4">Ваша корзина пуста</p>
                <Button onClick={() => setActiveTab('catalog')}>
                  Перейти в каталог
                </Button>
              </div>
            ) : (
              <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 space-y-4">
                  {cartItems.map(product => (
                    <Card key={product.id} className="p-4">
                      <div className="flex gap-4">
                        <div className="w-24 h-24 bg-secondary rounded overflow-hidden flex-shrink-0">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold mb-1">{product.name}</h4>
                          <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold">{product.price} ₽/{product.unit}</span>
                            <div className="flex items-center gap-2">
                              <Button size="sm" variant="outline" onClick={() => removeFromCart(product.id)}>
                                <Icon name="Minus" size={16} />
                              </Button>
                              <span className="w-8 text-center font-semibold">{cart[product.id]}</span>
                              <Button size="sm" variant="outline" onClick={() => addToCart(product.id)}>
                                <Icon name="Plus" size={16} />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>

                <div>
                  <Card className="p-6 sticky top-24">
                    <h3 className="text-xl font-bold mb-4">Итого</h3>
                    <div className="space-y-2 mb-6">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Товары ({cartCount} кг)</span>
                        <span>{totalPrice.toLocaleString()} ₽</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Доставка</span>
                        <span className="text-primary">Бесплатно</span>
                      </div>
                    </div>
                    <div className="border-t pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold">Всего</span>
                        <span className="text-2xl font-bold">{totalPrice.toLocaleString()} ₽</span>
                      </div>
                    </div>
                    <Button className="w-full" size="lg">
                      Оформить заказ
                    </Button>
                  </Card>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="delivery" className="animate-fade-in">
            <h2 className="text-4xl font-bold mb-8">Доставка и оплата</h2>
            
            <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
              <Card className="p-6">
                <Icon name="Truck" size={32} className="mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-3">Доставка</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="mt-1 text-primary flex-shrink-0" />
                    <span>Бесплатная доставка от 1000 ₽</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="mt-1 text-primary flex-shrink-0" />
                    <span>Доставка в день заказа</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="mt-1 text-primary flex-shrink-0" />
                    <span>Самовывоз с фермы</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <Icon name="CreditCard" size={32} className="mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-3">Оплата</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="mt-1 text-primary flex-shrink-0" />
                    <span>Картой онлайн</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="mt-1 text-primary flex-shrink-0" />
                    <span>При получении</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Icon name="Check" size={16} className="mt-1 text-primary flex-shrink-0" />
                    <span>Безопасная оплата</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-6">
                <Icon name="Leaf" size={32} className="mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-3">Качество</h3>
                <p className="text-muted-foreground">
                  Свежие овощи с фермы. Собираем урожай в день отправки. Гарантия качества и свежести продукции.
                </p>
              </Card>

              <Card className="p-6">
                <Icon name="Shield" size={32} className="mb-4 text-primary" />
                <h3 className="text-xl font-bold mb-3">Гарантия свежести</h3>
                <p className="text-muted-foreground">
                  Если продукт не соответствует вашим ожиданиям, мы вернём деньги или заменим товар.
                </p>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-bold text-lg mb-4">TAKZY17</h3>
              <p className="text-sm text-muted-foreground">Свежие овощи с доставкой</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Покупателям</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><button onClick={() => setActiveTab('delivery')}>Доставка</button></li>
                <li>Оплата</li>
                <li>Возврат</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Компания</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>О нас</li>
                <li>Контакты</li>
                <li>Наша ферма</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>info@takzy17.ru</li>
                <li>+7 (999) 123-45-67</li>
              </ul>
            </div>
          </div>
          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            © 2024 TAKZY17. Все права защищены.
          </div>
        </div>
      </footer>
    </div>
  );
}
