import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, Star, Users, Heart, Award, Shield, Sparkles } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <Calendar className="w-6 h-6 text-blue-500" />,
      title: "Réservation Simple",
      description: "Réservez votre rendez-vous en quelques clics"
    },
    {
      icon: <Clock className="w-6 h-6 text-blue-500" />,
      title: "Disponibilité 24/7",
      description: "Réservez à tout moment, jour et nuit"
    },
    {
      icon: <Star className="w-6 h-6 text-blue-500" />,
      title: "Services Premium",
      description: "Des prestations de qualité professionnelle"
    },
    {
      icon: <Users className="w-6 h-6 text-blue-500" />,
      title: "Suivi Personnalisé",
      description: "Un accompagnement sur mesure pour vos besoins"
    }
  ];

  const testimonials = [
    {
      name: "Sophie L.",
      comment: "Une expérience exceptionnelle ! Le service est impeccable et le personnel très professionnel.",
      rating: 5
    },
    {
      name: "Marie D.",
      comment: "Je recommande vivement. La qualité des soins est remarquable.",
      rating: 5
    },
    {
      name: "Julie M.",
      comment: "Un véritable moment de détente et de bien-être. Je reviendrai !",
      rating: 5
    }
  ];

  const advantages = [
    {
      icon: <Heart className="w-8 h-8 text-pink-500" />,
      title: "Expertise reconnue",
      description: "Notre équipe de professionnels qualifiés vous garantit des soins d'excellence"
    },
    {
      icon: <Award className="w-8 h-8 text-yellow-500" />,
      title: "Produits premium",
      description: "Nous utilisons exclusivement des produits haut de gamme pour votre satisfaction"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-500" />,
      title: "Hygiène garantie",
      description: "Nos protocoles d'hygiène stricts assurent votre sécurité"
    },
    {
      icon: <Sparkles className="w-8 h-8 text-purple-500" />,
      title: "Ambiance zen",
      description: "Un espace dédié à votre bien-être et votre relaxation"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <div 
        className="relative bg-cover bg-center h-[600px]" 
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1607779097040-26e80aa78e66?auto=format&fit=crop&q=80&w=2000")',
          backgroundBlendMode: 'overlay',
          backgroundColor: 'rgba(0, 0, 0, 0.4)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black opacity-50"></div>
        <div className="relative h-full flex flex-col items-center justify-center text-center px-4">
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Beautyplace Booking
          </h1>
          <p className="text-xl md:text-2xl text-white mb-8 max-w-2xl">
            Simplifiez vos prises de rendez-vous pour tous types de prestations beauté et bien-être
          </p>
          <Link 
            to="/booking" 
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition duration-300 shadow-lg"
          >
            Prendre rendez-vous
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Pourquoi nous choisir ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-1"
              >
                <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advantages Section */}
      <div className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Nos engagements
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {advantages.map((advantage, index) => (
              <div 
                key={index}
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="flex justify-center mb-4">
                  {advantage.icon}
                </div>
                <h3 className="text-xl font-semibold text-center text-gray-800 mb-3">
                  {advantage.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {advantage.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">
            Ce que disent nos clients
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index}
                className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition duration-300"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4 italic">"{testimonial.comment}"</p>
                <p className="text-gray-800 font-semibold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            Prêt à prendre soin de vous ?
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Réservez votre prochain rendez-vous dès maintenant et profitez de nos services professionnels.
          </p>
          <div className="flex justify-center gap-4">
            <Link 
              to="/services" 
              className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition duration-300 shadow-lg"
            >
              Découvrir nos services
            </Link>
            <Link 
              to="/booking" 
              className="bg-[#C87B76] text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-[#B66B66] transition duration-300 shadow-lg"
            >
              Réserver maintenant
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;