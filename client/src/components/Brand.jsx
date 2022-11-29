import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper";
import "swiper/css";

import { brand } from '../utils/data';

const Brand = () => {
    return (
        <section className="mt-6">
            <Swiper
                spaceBetween={30}
                loop={true}
                autoplay={{
                    delay: 1500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                breakpoints={{
                    378: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 5 }
                }}
                navigation={true}
                modules={[Autoplay]}
                className="mySwiper"
            >
                {
                    brand.logo.map((data) => (
                        <SwiperSlide key={data.id}>
                            <div className="w-[150px]">
                                <img 
                                    src={data.image} 
                                    alt=""
                                    className="w-[100%] object-cover cursor-pointer"
                                />
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </section>
    )
};

export default Brand;