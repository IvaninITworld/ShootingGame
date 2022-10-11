import pygame
import os
import math
import random
from game_bullet import EnemyBullet

game_main_dir = os.path.dirname(os.path.abspath(__file__))
img_dir = os.path.join(game_main_dir)

class Enemy(pygame.sprite.Sprite):
    def __init__(self, x, y):
        pygame.sprite.Sprite.__init__(self)
        self.images = \
            [pygame.image.load(img_dir + "/images/double_turret.png")]
        self.image = self.images[0]
        self.rect = self.image.get_rect()
        self.rect.center = [x, y]
        self.speed = 4
        self.x = x
        self.y = y
        self.theta = 0
        self.angle = 0        
        self.current_frame = 0
        self.delay_frame = random.randint(30, 200)
        self.first_shoot = True
        self.next_shoot_delay_frame = 5

    def update(self, GameMain):
        ty = GameMain.flight.rect.centery
        sy = self.rect.centery
        tx = GameMain.flight.rect.centerx
        sx = self.rect.centerx
        self.angle = math.atan2(ty - sy, tx - sx)
        self.theta = math.degrees(self.angle) * -1
        self.image = pygame.transform.rotate(self.images[0], self.theta)
        self.rect = self.image.get_rect()
        self.rect.center = [self.x, self.y]
        self.current_frame += 1

        self.behavior(GameMain)

    def behavior(self, GameMain):
        if self.first_shoot and\
             self.current_frame >= self.delay_frame:
            
            self.createBullet(GameMain.bullet_group, 1)
            self.current_frame = 0
            self.first_shoot = False
        
        if not(self.first_shoot) and\
             self.current_frame > self.next_shoot_delay_frame:
            
            self.createBullet(GameMain.bullet_group, 1)
            self.current_frame = 0
            self.first_shoot = True
    
    def createBullet(self, bullet_group, speed):
        enemyBullet = EnemyBullet(self.x, self.y, self.angle, self.theta, speed)
        bullet_group.add(enemyBullet)
        
        # self.printText(GameMain.screen, str(angle), 50, 10)
        # self.printText(GameMain.screen, "left :=" + str(self.rect.topleft[0]), 50, 35)
        # self.printText(GameMain.screen, "top :=" + str(self.rect.topleft[1]), 200, 35)
        # self.printText(GameMain.screen, "width :=" + str(self.rect.width), 50, 60)
        # self.printText(GameMain.screen, "height :=" + str(self.rect.height), 200, 60)
        # font = pygame.font.SysFont("arial", 30, True, False)
        # txt_angle= font.render(str(angle), True, [255, 255, 255])
        # txt_rect = txt_angle.get_rect()
        # txt_rect.x = 100
        # txt_rect.y = 50
        # GameMain.screen.blit(txt_angle, txt_rect)
        # theta = math.degrees(angle)
        # self.image = pygame.transform.rotate(self.images[0], -theta)
        # self.rect = self.image.get_rect()
        # # self.printText(GameMain.screen, "cx :=" + str(self.rect.centerx), 50, 85)
        # # self.printText(GameMain.screen, "cy :=" + str(self.rect.centery), 200, 85)
        # self.rect.center = [self.x, self.y]
        #self.printText(GameMain.screen, "topleft :=" + str(self.image.get_rect().topleft[0]), 50, 60)
        #self.printText(GameMain.screen, "topleft :=" + str(self.image.get_rect().topleft[1]), 200, 60)
        # self.theta += 1
        # if self.count == 100:
        #     self.count = 0
        #     self.theta += 1
        # else:
        #     self.count+= 1
        # self.image = self.images[self.theta]
        # self.rect = self.image.get_rect()
        # self.rect.center = [self.x, self.y]

    # def printText(self, screen, msg, x, y):
    #     font = pygame.font.SysFont("arial", 25, True, False)
    #     text = font.render(str(msg), True, [255, 255, 255])
    #     txt_rect = text.get_rect()
    #     txt_rect.x = x
    #     txt_rect.y = y
    #     screen.blit(text, txt_rect)
