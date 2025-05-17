export const game1Config = {
  // 0: bunny_blue, 1: bunny_red, 2: boat_blue, 3: boat_red
  roundsOrder: [0, 1, 2, 3, 1, 0, 2, 3, 0, 1],
  totalRounds: 10,
  swapAt: 5 // After this round, switch to color rule
};

export const game2Config = {
  // You can set any order you want, e.g. [0,1,1,0,0,1,0,1,1,0]
  // 0 = day, 1 = night
  roundsOrder: [0, 1, 0, 1, 1, 0, 0, 1, 0, 1],
  totalRounds: 10, // Should match roundsOrder.length
  swapAt: 5 // After this round, rules swap
};