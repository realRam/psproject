module Main where
import Prelude
import Control.Monad.Eff (Eff)
import Control.Monad.Eff.Console (CONSOLE)
import Control.Monad.Eff.JQuery (addClass, body, create, css, getCss, getPageX, getPageY, off, on, select, setAttr)
import Control.Monad.Eff.JQuery (append) as JQ
import Control.Monad.Eff.Timer (TIMER, setTimeout)
import Control.Monad.ST (ST, STRef, newSTRef, readSTRef, writeSTRef)
import DOM (DOM)
import DOM.HTML (window)
import DOM.HTML.Window (requestAnimationFrame)
import Data.Array (replicate, snoc)
import Data.Array.Partial (tail)
import Data.Int (toNumber)
import Math (sqrt)
import Matrices (RotationVector, TransformMatrix, angle, average, changeSpeed, multiply, noRotation, rotationVector, sum, toString, toTransformMatrix)
import Partial.Unsafe (unsafePartial)

framesPerSecond :: Int
framesPerSecond = 60
speedSensitivity :: Int
speedSensitivity = 25
rotationScale :: Number
rotationScale = 0.4
decelRate :: Number
decelRate = 40.0 / toNumber framesPerSecond

drawCube :: forall e. Eff (dom :: DOM |e) Unit
drawCube = do
  front <- create "<div>"
  setAttr "id" "front_face" front
  addClass "face" front
  back <- create "<div>"
  setAttr "id" "back_face" back
  addClass "face" back
  right <- create "<div>"
  setAttr "id" "right_face" right
  addClass "face" right
  left <- create "<div>"
  setAttr "id" "left_face" left
  addClass "face" left
  top <- create "<div>"
  setAttr "id" "top_face" top
  addClass "face" top
  bottom <- create "<div>"
  setAttr "id" "bottom_face" bottom
  addClass "face" bottom
  cube <- create "<div>"
  addClass "cube" cube

  css {
  	transform : "translateX(-100px) translateY(-100px) translateZ(100px)",
    backgroundColor: "#082090"--dark blue
  } front

  css {
  	transform : "translateX(-100px) translateY(-100px) translateZ(-100px)",
    backgroundColor: "#01d6d3"--sky blue
  } back
  css {
  	transform : "translateY(-100px) rotateY(90deg)",
    backgroundColor: "#ef3737"--red
  } right
  css {
    transform : "translateY(-100px) translateX(-200px) rotateY(90deg)",
    backgroundColor: "#df01a5"--pink
  } left
  css {
    transform : "translateX(-100px) translateY(-200px) rotateX(90deg)",
    backgroundColor: "#fdf900"--yellow
  } top
  css {
    transform : "translateX(-100px) rotateX(90deg)",
    backgroundColor: "#00ff00"--light green
  } bottom

  css {
    position: "relative",
  	transformStyle: "preserve-3d"
  } cube

  JQ.append front cube
  JQ.append back cube
  JQ.append right cube
  JQ.append left cube
  JQ.append top cube
  JQ.append bottom cube

  cubeWrapper <- create "<div>"
  setAttr "id" "cube-wrapper" cubeWrapper
  css {
    position : "absolute",
    left : "50%",
    top : "50%",
    perspective: "1500px"
  } cubeWrapper
  JQ.append cube cubeWrapper

  body <- body
  JQ.append cubeWrapper body

  css { width: "100%", height: "100%" } body

  face <- select ".face"
  css {
  	position : "absolute",
  	width : "200px",
  	height : "200px"
  } face

  css { transform: "rotateX(-45deg)rotateY(45deg)"} cube

startSpeedometer :: forall eff h. STRef h RotationVector
  -> STRef h { x::Number, y::Number } -> STRef h Boolean
  -> Eff (dom :: DOM, st :: ST h, timer :: TIMER, console :: CONSOLE  | eff) Unit
startSpeedometer velocityRef mousePosRef runFlagRef = do
  let looper prevPos velocities = do
        let speedometer = do
              pos <- readSTRef mousePosRef
              let r = rotationVector [
                (negate ( prevPos.y-pos.y)) * rotationScale,
                ( prevPos.x-pos.x ) * rotationScale,
                0.0, 0.0
              ]
              let newVels = snoc (unsafePartial tail velocities) r
              runFlag <- readSTRef runFlagRef
              if runFlag then looper pos newVels
                else do
                  currentVelocity <- readSTRef velocityRef
                  void $ writeSTRef velocityRef (sum [average newVels, currentVelocity])
        void $ setTimeout speedSensitivity (speedometer)
  p <- readSTRef mousePosRef
  looper p (replicate 5 noRotation)

rotateCube :: forall h e. STRef h TransformMatrix
  -> RotationVector
  -> Eff (dom :: DOM, st:: ST h |e) TransformMatrix
rotateCube transformRef rotation = do
  cube <- select ".cube"
  transform <- readSTRef transformRef
  css {
    transform: "matrix3d" <> toString transform
                  <> " rotate3d" <> (toString $ multiply transform rotation)
  } cube
  t <- getCss "transform" cube
  pure (toTransformMatrix t)

startMouseHandlers :: forall h e. STRef h TransformMatrix
  -> STRef h RotationVector
  -> Eff (dom :: DOM, st :: ST h, timer :: TIMER, console :: CONSOLE | e) Unit
startMouseHandlers transformRef velocityRef = do
  body <- body
  mousePosRef <- newSTRef {x:0.0,y:0.0}
  let downHandler event jq = do
        downX <- getPageX event
        downY <- getPageY event
        void $ writeSTRef mousePosRef {x: downX, y:downY}
        runFlagRef <- newSTRef true
        let moveHandler event' jq' = do
              x <- getPageX event'
              y <- getPageY event'
              void $ writeSTRef mousePosRef {x: x, y:y}
              let dx = negate (y - downY)
              let dy = x - downX
              let rotation = rotationVector [dx, dy, 0.0,
                    sqrt (dx * dx + dy * dy) * rotationScale]
              rotateCube transformRef rotation
        let upHandler event' jq' = do
              cube <- select ".cube"
              off "mousemove" body
              t <- getCss "transform" cube
              void $ writeSTRef transformRef (toTransformMatrix t)
              writeSTRef runFlagRef false
        let decelerator = do
              v <- readSTRef velocityRef
              runFlag <- readSTRef runFlagRef
              if runFlag && angle v > 0.0 then do
                void $ writeSTRef velocityRef $
                  if (angle v - decelRate > 0.0) then changeSpeed (angle v - decelRate) v else noRotation
                void $ setTimeout (1000 / framesPerSecond) decelerator
                else pure unit
        on "mousemove" moveHandler body
        on "mouseup" upHandler body
        decelerator
        startSpeedometer velocityRef mousePosRef runFlagRef
  on "mousedown" downHandler body

startSpinner :: forall h e. STRef h TransformMatrix
  -> STRef h RotationVector
  -> Eff (dom :: DOM, st :: ST h | e) Unit
startSpinner transformRef velocityRef = do
  let spinner = do
        rotation <- readSTRef velocityRef
        if angle rotation /= 0.0
          then do
            t <- rotateCube transformRef rotation
            void $ writeSTRef transformRef t
          else pure unit
        w <- window
        void $ requestAnimationFrame spinner w
  spinner

run :: forall e h. Eff (dom :: DOM, st :: ST h, timer :: TIMER, console :: CONSOLE | e) Unit
run = do
  cube <- select ".cube"
  t <- getCss "transform" cube
  transformRef <- newSTRef $ toTransformMatrix t
  velocityRef <- newSTRef noRotation
  startSpinner transformRef velocityRef
  startMouseHandlers transformRef velocityRef
  pure unit

main :: forall h e. Eff (dom :: DOM, st :: ST h, timer :: TIMER, console :: CONSOLE | e) Unit
main = do
  drawCube
  run
