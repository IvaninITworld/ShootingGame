import pygame
import os
import math

game_main_dir = os.path.dirname(os.path.abspath(__file__))
img_dir = os.path.join(game_main_dir)

class EnemyBullet(pygame.sprite.Sprite):
    def __init__(self, x, y, angle, theta, speed):
        pygame.sprite.Sprite.__init__(self)        
        self.image = pygame.transform.rotate(\
            pygame.image.load(img_dir + "/images/enemy_bullet_01.png"), theta)
        self.rect = self.image.get_rect()
        self.rect.center = [x, y]
        self.angle = angle
        self.speed = speed
        self.max_speed = 10.0        
        self.x = x
        self.y = y

    def update(self, GameMain):
        self.dx = math.cos(self.angle) * self.speed
        self.dy = math.sin(self.angle) * self.speed
        if self.max_speed > self.speed:
            self.speed += 0.2

        # self.x = self.x + self.dx
        # self.y = self.y + self.dy
        self.x += self.dx
        self.y += self.dy
        self.rect.centerx = int(self.x)
        self.rect.centery = int(self.y)

        if self.rect.y < -10:
            self.kill()
        elif self.rect.y > 810:
            self.kill()
        elif self.rect.x < -10:
            self.kill()
        elif self.rect.x > 810:
            self.kill()


