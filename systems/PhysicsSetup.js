export function applyCharacterPhysics(sprite) {
  sprite.body.setDragX(80);
  sprite.body.setBounceY(0.06);
  sprite.body.setMaxVelocityX(220);
  sprite.body.setMaxVelocityY(900);
}
