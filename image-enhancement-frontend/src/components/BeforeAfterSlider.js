import React from 'react';
import ReactBeforeSliderComponent from 'react-before-after-slider-component';
import 'react-before-after-slider-component/dist/build.css';

const BeforeAfterSlider = ({ beforeImage, afterImage }) => {
    const FIRST_IMAGE = {
        imageUrl: beforeImage,
    };
    const SECOND_IMAGE = {
        imageUrl: afterImage,
    };

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <ReactBeforeSliderComponent
                firstImage={FIRST_IMAGE}
                secondImage={SECOND_IMAGE}
                delimiterColor="gray"
            />
        </div>
    );
};

export default BeforeAfterSlider;