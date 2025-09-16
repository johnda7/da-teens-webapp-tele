// Mock data for development and testing
export const seedData = {
  // User data
  userProfiles: [
    {
      id: 'user-1',
      name: 'Алекс',
      age: 16,
      currentModule: 1,
      currentWeek: 2,
      completedModules: 0,
      streak: 7,
      cohortId: 'teens-14-16-cohort-a',
      joinedAt: '2024-01-15',
      badges: ['first-step', 'check-in-streak-7']
    }
  ],

  // Check-ins
  checkIns: [
    {
      id: 'checkin-1',
      userId: 'user-1',
      date: '2024-01-20',
      mood: 7,
      anxiety: 3,
      sleepHours: 8,
      note: 'Хороший день! Справился с презентацией в школе.'
    },
    {
      id: 'checkin-2',
      userId: 'user-1',
      date: '2024-01-21',
      mood: 6,
      anxiety: 4,
      sleepHours: 7.5,
      note: 'Немного волновался из-за контрольной, но дыхательная практика помогла.'
    }
  ],

  // Crisis flags (for curator/admin view)
  crisisFlags: [
    {
      id: 'crisis-1',
      userId: 'user-2',
      level: 'high',
      message: 'Мне очень тяжело, не знаю что делать',
      createdAt: '2024-01-21T15:30:00Z',
      status: 'pending',
      curatorNotified: true
    }
  ],

  // Assignments and submissions
  assignments: [
    {
      id: 'assignment-1',
      cohortId: 'teens-14-16-cohort-a',
      moduleId: 1,
      week: 1,
      title: 'Практика "Колесо уверенности"',
      description: 'Выполни упражнение и поделись результатами',
      dueDate: '2024-01-25',
      type: 'practice'
    }
  ],

  submissions: [
    {
      id: 'submission-1',
      assignmentId: 'assignment-1',
      userId: 'user-1',
      content: 'Я нарисовал колесо и понял, что моя сильная сторона - это креативность. Хочу больше развивать коммуникацию.',
      submittedAt: '2024-01-22T14:20:00Z',
      status: 'submitted',
      curatorFeedback: null
    }
  ],

  // Badge awards log
  badgeAwards: [
    {
      id: 'award-1',
      userId: 'user-1',
      badgeId: 'first-step',
      awardedAt: '2024-01-15T10:00:00Z',
      reason: 'Регистрация в программе'
    },
    {
      id: 'award-2',
      userId: 'user-1',
      badgeId: 'check-in-streak-7',
      awardedAt: '2024-01-21T18:00:00Z',
      reason: '7 дней подряд чек-инов'
    }
  ]
};

// Helper functions for working with mock data
export function getUserById(id: string) {
  return seedData.userProfiles.find(user => user.id === id);
}

export function getUserCheckIns(userId: string) {
  return seedData.checkIns.filter(checkin => checkin.userId === userId);
}

export function getUserBadges(userId: string) {
  const user = getUserById(userId);
  return user ? user.badges : [];
}

export function addCheckIn(userId: string, checkInData: any) {
  const newCheckIn = {
    id: `checkin-${Date.now()}`,
    userId,
    ...checkInData
  };
  seedData.checkIns.push(newCheckIn);
  return newCheckIn;
}

export function createSOSFlag(userId: string, level: string, message: string) {
  const newFlag = {
    id: `crisis-${Date.now()}`,
    userId,
    level,
    message,
    createdAt: new Date().toISOString(),
    status: 'pending',
    curatorNotified: true
  };
  seedData.crisisFlags.push(newFlag);
  return newFlag;
}

export function awardBadge(userId: string, badgeId: string, reason: string) {
  const user = getUserById(userId);
  if (user && !user.badges.includes(badgeId)) {
    user.badges.push(badgeId);
    
    const award = {
      id: `award-${Date.now()}`,
      userId,
      badgeId,
      awardedAt: new Date().toISOString(),
      reason
    };
    seedData.badgeAwards.push(award);
    return award;
  }
  return null;
}

// Check if user should get new badges based on activity
export function checkForNewBadges(userId: string): string[] {
  const user = getUserById(userId);
  
  if (!user) return [];

  const newBadges: string[] = [];

  // Check for streak badges
  if (user.streak >= 7 && !user.badges.includes('check-in-streak-7')) {
    awardBadge(userId, 'check-in-streak-7', '7 дней подряд чек-инов');
    newBadges.push('check-in-streak-7');
  }

  if (user.streak >= 30 && !user.badges.includes('check-in-streak-30')) {
    awardBadge(userId, 'check-in-streak-30', '30 дней подряд чек-инов');
    newBadges.push('check-in-streak-30');
  }

  // Check for module completion badges
  if (user.completedModules >= 1 && !user.badges.includes('module-complete')) {
    awardBadge(userId, 'module-complete', 'Завершил первый модуль');
    newBadges.push('module-complete');
  }

  if (user.completedModules >= 3 && !user.badges.includes('three-modules')) {
    awardBadge(userId, 'three-modules', 'Завершил 3 модуля');
    newBadges.push('three-modules');
  }

  return newBadges;
}