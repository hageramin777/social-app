import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import { MessageCircle, Image, Bell, Users, Heart } from "lucide-react";
import Footer from "../Footer/Footer";
import Navbar from "../Navbar/Navbar";
import { authContext } from "../context/AuthContextProvider";

export default function Layout() {
  const { token } = useContext(authContext);

  return (
    <>
      <Navbar />

      <div className="flex min-h-screen">

        {!token && (
        <div className="hidden lg:flex lg:w-1/2 sticky top-0 h-screen relative overflow-hidden text-white p-10 flex-col justify-between">
          <img
            src="/./public/download.jpeg"
            alt="background"
            className="absolute inset-0 w-full h-full object-cover"
          />
<div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-black/20"></div>

          <div className="relative z-10">

            {/* Logo */}
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#21144996] rounded-lg flex items-center justify-center font-bold">
                S
              </div>

              <span className="text-xl font-bold">
                SocialHub
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl font-extrabold leading-tight mb-2">
              Welcome Back
              <br />
              <span className="text-[#21144996]">
                to SocialHub App
              </span>
            </h1>

            <p className="text-white/80 mb-8">
              Signin to connect people all over the world
            </p>


    <div className="grid grid-cols-4 gap-4 mb-8">

  <div className="bg-white/10 rounded-xl p-4">
    <MessageCircle className="w-5 h-5 text-green-700 mb-2" />

    <p className="font-semibold text-sm">
      Real-time Chat
    </p>

    <p className="text-xs text-white/70">
      Instant messaging
    </p>
  </div>


  <div className="bg-white/10 rounded-xl p-4">
    <Image className="w-6 h-6 text-indigo-950 mb-2" />

    <p className="font-semibold text-sm">
      Share Media
    </p>

    <p className="text-xs text-white/70">
      Photos & videos
    </p>
  </div>


  <div className="bg-white/10 rounded-xl p-4">
    <Bell className="w-6 h-5 text-yellow-300 mb-2" />

    <p className="font-semibold text-sm">
      Smart Alerts
    </p>

    <p className="text-xs text-white/70">
      Stay updated
    </p>
  </div>


  <div className="bg-white/10 rounded-xl p-4">
<Users className="w-6 h-6 text-gray-700" />
    <p className="font-semibold text-sm">
      Communities
    </p>

    <p className="text-xs text-white/70">
      Find your tribe
    </p>
  </div>

</div>

            {/* Stats */}
            <div className="flex gap-8 text-sm">

              <div>
                <p className="font-bold text-lg">
                    <Users className="w-5 h-5 text-gray-700" /> 2M+
                </p>
                <p className="text-white/70">
                  Active Users
                </p>
              </div>

              <div>
                <p className="font-bold text-lg">
                        <Heart className="w-5 h-5 text-red-400 fill-red-400" />

                   10M+
                </p>
                <p className="text-white/70">
                  Posts Shared
                </p>
              </div>

              <div>
               <p className="font-bold text-lg flex items-center gap-2">
  <svg
    className="w-5 h-5 text-white"
    aria-hidden="true"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 18"
  >
    <path d="M18 0H2a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h3.546l3.2 3.659a1 1 0 0 0 1.506 0L13.454 14H18a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-8 10H5a1 1 0 0 1 0-2h5a1 1 0 1 1 0 2Zm5-4H5a1 1 0 0 1 0-2h10a1 1 0 1 1 0 2Z" />
  </svg>

  <span>50M+</span>
</p>
                <p className="text-white/70">
                  Messages Sent
                </p>
              </div>

            </div>

          </div>

        </div>
        )}

        <div className={`w-full ${!token ? "lg:w-1/2" : ""} flex items-center justify-center bg-white p-4`}>
          <Outlet />
        </div>


      </div>

      <Footer />
    </>
  );
}
