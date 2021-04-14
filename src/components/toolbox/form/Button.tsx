import React, { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useSpring, useTransform } from 'framer-motion'

interface ButtonInterface {
  text?: string
  icon?: any
  iconLocation?: "left" | "right"
  border?: string
  textColor?: string
  background?: string
  link_to?: string
  width?: number
  onClick?: Function
  bold?: boolean
  large?: boolean
  disabled?: boolean
  disabledBackground?: string
  transformDisabled?: boolean
}

const Button = ({ text, disabled, disabledBackground, transformDisabled, icon, bold, width, large, border, link_to, iconLocation, onClick, textColor, background }: ButtonInterface) => {

  const xMouseSpring = useSpring(0, { duration: 10, bounce: 0, damping: 0 });

  const effectContainerRef = useRef<HTMLDivElement>(null);
  const effectRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLDivElement>(null)
  const bgColor = (): string => {
    if (disabled == true) {
      if (disabledBackground) return disabledBackground;
      return `#ced5db`;
    }
    // default black
    return background ? background : "#1E2019"
  }

  const getIconLocation = (): "left" | "right" | "" => {

    if (!icon) return ""
    return iconLocation && ["left", "right"].includes(iconLocation! as string) ?
      iconLocation : "left"
  }

  const initTransforms = () => {
    if (transformDisabled == true) return;
    window.addEventListener(`mouseout`, endTransforms)
    window.addEventListener(`mousemove`, handleTransform)
  }

  const handleTransform = (e: MouseEvent) => {
    if (!buttonRef.current) return;
    let bounds_: DOMRect = buttonRef.current.getBoundingClientRect();

    let r_x = 2 * (((e.x - bounds_.left) / (bounds_.right - bounds_.left)) - 0.5);
    let r_y = 2 * (((e.y - bounds_.top) / (bounds_.bottom - bounds_.top)) - 0.5);
    buttonRef.current.style.transform
      = `perspective(6.5cm) rotateX(${(bounds_.height * 0.03) * r_y}deg) rotateY(${(bounds_.width * 0.03) * -1 * r_x}deg)`;
    buttonRef.current.style.boxShadow = `${r_x * 5}px ${r_y * 5}px 10px rgba(59, 67, 83, 0.1)`;
  }

  const handleOnClick = () => {
    if (disabled == true) return;
    if (onClick) onClick();
  }

  const endTransforms = () => {

    if (buttonRef.current) {
      buttonRef.current.style.transform = `perspective(6.5cm) rotateX(0deg) rotateY(0deg)`;
      buttonRef.current.style.boxShadow = `0px 0px 3.5px rgba(0, 0, 0, 0)`;
    }
    window.removeEventListener(`mousemove`, handleTransform)
    window.removeEventListener(`mouseout`, endTransforms)
  }

  const handleEffectMotion = (e: any) => {
    // console.log(e.clientX, e.clientY);
    if (effectContainerRef == null || effectContainerRef.current == null) return;
    if (effectRef == null || effectRef.current == null) return;

    // get the bounding rect
    let bounds = effectContainerRef.current.getBoundingClientRect();
    let b2 = effectRef.current.getBoundingClientRect();
    let x_ = e.clientX - bounds.left;
    xMouseSpring.set(x_ - (b2.width / 2));

    // move x pos
    // effectRef.current.animate([
    //   {transform: `translateX(${x_}px)`}
    //   // {left: `${x_}px`}
    // ], {
    //   duration: 100,
    //   iterations: 1
    // });
  }

  return (<React.Fragment>

    {link_to ? <Link to={link_to}><div
      ref={buttonRef}
      className={`app-button ${getIconLocation()}-icon`}
      onMouseOver={initTransforms}
      onClick={() => {
        handleOnClick();
      }}
      style={{
        cursor: disabled == true ? `not-allowed` : `pointer`,
        backgroundColor: bgColor(),
        border: border ? `1px solid ${border}` : ``,
        color: (() => { if (disabled == true) return `white`; return textColor ? textColor : `black`; })(),
        width: `${width ?? width}px`,
        padding: large ? `8px 20px` : `6px 20px`
      }}
    >

      <div ref={effectContainerRef} className="effect-holder" onMouseMove={handleEffectMotion}>
        <motion.div ref={effectRef}
          style={{
            translateX: xMouseSpring
          }}
        />
      </div>

      <div className="button-holder">{
        getIconLocation() == "left" &&
        <div className={`icon-area ${getIconLocation()}`}>
          {icon}
        </div>
      }
        <div className={`text-area`} style={{
          fontWeight: bold == true ? 600 : 100,
          fontSize: large ? `1rem` : `0.8rem`
        }}>{text}</div>
        {
          getIconLocation() == "right" &&
          <div className={`icon-area ${getIconLocation()}`}>
            {icon}
          </div>
        }</div>
    </div></Link>
      : <div
        ref={buttonRef}
        className={`app-button ${getIconLocation()}-icon`}
        onMouseOver={initTransforms}
        onClick={() => {
          handleOnClick();
        }}
        style={{
          cursor: disabled == true ? `not-allowed` : `pointer`,
          backgroundColor: bgColor(),
          border: border ? `1px solid ${border}` : ``,
          color: textColor ? textColor : `black`,
          width: `${width ?? width}px`,
          padding: large ? `8px 20px` : `6px 20px`
        }}
      >
        <div ref={effectContainerRef} className="effect-holder" onMouseMove={handleEffectMotion}>
          <motion.div ref={effectRef}
            style={{
              translateX: xMouseSpring
            }}
          />
        </div>
        <div className="button-holder">{
          getIconLocation() == "left" &&
          <div className={`icon-area ${getIconLocation()}`}>
            {icon}
          </div>
        }
          <div className={`text-area`} style={{
            fontWeight: bold == true ? 600 : 100,
            fontSize: large ? `1rem` : `0.8rem`
          }}>{text}</div>
          {
            getIconLocation() == "right" &&
            <div className={`icon-area ${getIconLocation()}`}>
              {icon}
            </div>
          }</div>
      </div>}
  </React.Fragment>)
}

export default Button