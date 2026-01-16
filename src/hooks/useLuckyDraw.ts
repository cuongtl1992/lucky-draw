import { useState, useEffect, useCallback } from 'react';
import {
  getAllParticipants,
  getAllWinners,
  getWinningNumbers,
  saveWinner,
  getParticipantByNumber
} from '../services/firebase';
import type { Participant, Winner } from '../types';

export function useLuckyDraw() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [winners, setWinners] = useState<Winner[]>([]);
  const [availableNumbers, setAvailableNumbers] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [participantsData, winnersData, winningNumbers] = await Promise.all([
        getAllParticipants(),
        getAllWinners(),
        getWinningNumbers()
      ]);

      setParticipants(participantsData);
      setWinners(winnersData);

      // Calculate available numbers (registered but not won yet)
      const winningSet = new Set(winningNumbers);
      const available = participantsData
        .filter(p => !winningSet.has(p.number))
        .map(p => p.number);
      setAvailableNumbers(available);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const drawWinner = async (prize: string): Promise<Winner | null> => {
    if (availableNumbers.length === 0) {
      return null;
    }

    // Random select from available numbers
    const randomIndex = Math.floor(Math.random() * availableNumbers.length);
    const winningNumber = availableNumbers[randomIndex];

    // Find participant
    const participant = await getParticipantByNumber(winningNumber);
    if (!participant) {
      console.error('Participant not found for number:', winningNumber);
      return null;
    }

    // Save winner
    const winner = await saveWinner(
      winningNumber,
      participant.id,
      participant.name,
      prize
    );

    // Update local state
    setWinners(prev => [winner, ...prev]);
    setAvailableNumbers(prev => prev.filter(n => n !== winningNumber));

    return winner;
  };

  return {
    participants,
    winners,
    availableNumbers,
    loading,
    drawWinner,
    refresh: loadData
  };
}
