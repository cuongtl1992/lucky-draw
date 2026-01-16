import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useLuckyDraw } from '../hooks/useLuckyDraw';
import { SlotMachine } from './SlotMachine';
import { WinnerHistory } from './WinnerHistory';
import { deleteAllWinners, deleteAllParticipants } from '../services/firebase';

type Tab = 'draw' | 'history' | 'participants' | 'settings';

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<Tab>('draw');
  const [showConfirm, setShowConfirm] = useState<'winners' | 'participants' | 'all' | null>(null);
  const [deleting, setDeleting] = useState(false);
  const { logout, user } = useAuth();
  const { participants, winners, availableNumbers, loading, drawWinner, refresh } = useLuckyDraw();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const handleDeleteWinners = async () => {
    setDeleting(true);
    try {
      await deleteAllWinners();
      await refresh();
    } catch (error) {
      console.error('Error deleting winners:', error);
      alert('Có lỗi khi xóa dữ liệu!');
    } finally {
      setDeleting(false);
      setShowConfirm(null);
    }
  };

  const handleDeleteParticipants = async () => {
    setDeleting(true);
    try {
      await deleteAllParticipants();
      await refresh();
    } catch (error) {
      console.error('Error deleting participants:', error);
      alert('Có lỗi khi xóa dữ liệu!');
    } finally {
      setDeleting(false);
      setShowConfirm(null);
    }
  };

  const handleDeleteAll = async () => {
    setDeleting(true);
    try {
      await deleteAllWinners();
      await deleteAllParticipants();
      await refresh();
    } catch (error) {
      console.error('Error deleting all:', error);
      alert('Có lỗi khi xóa dữ liệu!');
    } finally {
      setDeleting(false);
      setShowConfirm(null);
    }
  };

  const tabs = [
    { id: 'draw' as Tab, label: 'Quay Số', icon: '🎰' },
    { id: 'history' as Tab, label: 'Lịch Sử', icon: '📋' },
    { id: 'participants' as Tab, label: 'Người Chơi', icon: '👥' },
    { id: 'settings' as Tab, label: 'Cài Đặt', icon: '⚙️' }
  ];

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold text-lucky-gold">Admin Panel</h1>
            <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={refresh}
              className="px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
            >
              🔄 Làm mới
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
            >
              Đăng xuất
            </button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-2 mb-6 bg-white/5 p-1 rounded-xl"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === tab.id
                  ? 'bg-lucky-gold text-lucky-dark'
                  : 'text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'draw' && (
            <div className="flex flex-col items-center">
              <SlotMachine
                availableNumbers={availableNumbers}
                onDrawComplete={drawWinner}
                disabled={loading}
              />
            </div>
          )}

          {activeTab === 'history' && (
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>🏆</span>
                Lịch sử trúng thưởng ({winners.length})
              </h2>
              <WinnerHistory winners={winners} loading={loading} />
            </div>
          )}

          {activeTab === 'participants' && (
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <span>👥</span>
                Người tham gia ({participants.length})
              </h2>

              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lucky-gold"></div>
                </div>
              ) : participants.length === 0 ? (
                <div className="text-center py-12">
                  <span className="text-6xl">👤</span>
                  <p className="text-gray-400 mt-4">Chưa có ai đăng ký</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Số</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Tên</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Email</th>
                        <th className="text-left py-3 px-4 text-gray-400 font-medium">Trạng thái</th>
                      </tr>
                    </thead>
                    <tbody>
                      {participants.map((participant, index) => {
                        const isWinner = winners.some(w => w.number === participant.number);
                        return (
                          <motion.tr
                            key={participant.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.02 }}
                            className="border-b border-white/5 hover:bg-white/5"
                          >
                            <td className="py-3 px-4">
                              <span className={`font-bold text-lg ${isWinner ? 'text-green-400' : 'text-lucky-gold'}`}>
                                {participant.number.toString().padStart(3, '0')}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-white">{participant.name}</td>
                            <td className="py-3 px-4 text-gray-400">{participant.email}</td>
                            <td className="py-3 px-4">
                              {isWinner ? (
                                <span className="px-2 py-1 bg-green-500/20 text-green-400 text-sm rounded-full">
                                  🎉 Đã trúng
                                </span>
                              ) : (
                                <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-sm rounded-full">
                                  Chưa quay
                                </span>
                              )}
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="bg-white/5 rounded-2xl p-6 border border-white/10">
              <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <span>⚙️</span>
                Cài đặt & Quản lý dữ liệu
              </h2>

              <div className="space-y-4">
                {/* Delete Winners */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Xóa lịch sử trúng thưởng</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Xóa tất cả {winners.length} người đã trúng thưởng. Người chơi vẫn giữ nguyên.
                      </p>
                    </div>
                    {showConfirm === 'winners' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleDeleteWinners}
                          disabled={deleting}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                        >
                          {deleting ? 'Đang xóa...' : 'Xác nhận'}
                        </button>
                        <button
                          onClick={() => setShowConfirm(null)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowConfirm('winners')}
                        className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30"
                      >
                        🗑️ Xóa lịch sử
                      </button>
                    )}
                  </div>
                </div>

                {/* Delete Participants */}
                <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-white font-medium">Xóa người tham gia</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Xóa tất cả {participants.length} người đã đăng ký.
                      </p>
                    </div>
                    {showConfirm === 'participants' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleDeleteParticipants}
                          disabled={deleting}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                        >
                          {deleting ? 'Đang xóa...' : 'Xác nhận'}
                        </button>
                        <button
                          onClick={() => setShowConfirm(null)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowConfirm('participants')}
                        className="px-4 py-2 bg-orange-500/20 text-orange-400 rounded-lg hover:bg-orange-500/30"
                      >
                        🗑️ Xóa người chơi
                      </button>
                    )}
                  </div>
                </div>

                {/* Delete All */}
                <div className="bg-red-500/10 rounded-xl p-4 border border-red-500/30">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-red-400 font-medium">⚠️ Reset toàn bộ dữ liệu</h3>
                      <p className="text-gray-400 text-sm mt-1">
                        Xóa tất cả người chơi và lịch sử trúng thưởng. Hành động này không thể hoàn tác!
                      </p>
                    </div>
                    {showConfirm === 'all' ? (
                      <div className="flex gap-2">
                        <button
                          onClick={handleDeleteAll}
                          disabled={deleting}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                        >
                          {deleting ? 'Đang xóa...' : 'XÁC NHẬN XÓA'}
                        </button>
                        <button
                          onClick={() => setShowConfirm(null)}
                          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                        >
                          Hủy
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setShowConfirm('all')}
                        className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30"
                      >
                        🗑️ Reset tất cả
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 grid grid-cols-3 gap-4"
        >
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-3xl font-bold text-lucky-gold">{participants.length}</p>
            <p className="text-gray-400 text-sm mt-1">Người tham gia</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-3xl font-bold text-green-400">{winners.length}</p>
            <p className="text-gray-400 text-sm mt-1">Đã trúng thưởng</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 text-center border border-white/10">
            <p className="text-3xl font-bold text-blue-400">{availableNumbers.length}</p>
            <p className="text-gray-400 text-sm mt-1">Chưa quay</p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
