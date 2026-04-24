/****************************************************************************
** Meta object code from reading C++ file 'packet.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/packet.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'packet.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_EQPacket_t {
    QByteArrayData data[70];
    char stringdata0[863];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_EQPacket_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_EQPacket_t qt_meta_stringdata_EQPacket = {
    {
QT_MOC_LITERAL(0, 0, 8), // "EQPacket"
QT_MOC_LITERAL(1, 9, 9), // "cacheSize"
QT_MOC_LITERAL(2, 19, 0), // ""
QT_MOC_LITERAL(3, 20, 10), // "seqReceive"
QT_MOC_LITERAL(4, 31, 9), // "seqExpect"
QT_MOC_LITERAL(5, 41, 9), // "numPacket"
QT_MOC_LITERAL(6, 51, 9), // "maxLength"
QT_MOC_LITERAL(7, 61, 11), // "resetPacket"
QT_MOC_LITERAL(8, 73, 20), // "playbackSpeedChanged"
QT_MOC_LITERAL(9, 94, 13), // "clientChanged"
QT_MOC_LITERAL(10, 108, 9), // "in_addr_t"
QT_MOC_LITERAL(11, 118, 17), // "clientPortLatched"
QT_MOC_LITERAL(12, 136, 9), // "in_port_t"
QT_MOC_LITERAL(13, 146, 17), // "serverPortLatched"
QT_MOC_LITERAL(14, 164, 22), // "sessionTrackingChanged"
QT_MOC_LITERAL(15, 187, 7), // "uint8_t"
QT_MOC_LITERAL(16, 195, 23), // "toggle_session_tracking"
QT_MOC_LITERAL(17, 219, 13), // "filterChanged"
QT_MOC_LITERAL(18, 233, 10), // "stsMessage"
QT_MOC_LITERAL(19, 244, 9), // "newPacket"
QT_MOC_LITERAL(20, 254, 19), // "EQUDPIPPacketFormat"
QT_MOC_LITERAL(21, 274, 6), // "packet"
QT_MOC_LITERAL(22, 281, 14), // "rawWorldPacket"
QT_MOC_LITERAL(23, 296, 14), // "const uint8_t*"
QT_MOC_LITERAL(24, 311, 4), // "data"
QT_MOC_LITERAL(25, 316, 6), // "size_t"
QT_MOC_LITERAL(26, 323, 3), // "len"
QT_MOC_LITERAL(27, 327, 3), // "dir"
QT_MOC_LITERAL(28, 331, 8), // "uint16_t"
QT_MOC_LITERAL(29, 340, 6), // "opcode"
QT_MOC_LITERAL(30, 347, 18), // "decodedWorldPacket"
QT_MOC_LITERAL(31, 366, 21), // "const EQPacketOPCode*"
QT_MOC_LITERAL(32, 388, 11), // "opcodeEntry"
QT_MOC_LITERAL(33, 400, 7), // "unknown"
QT_MOC_LITERAL(34, 408, 13), // "rawZonePacket"
QT_MOC_LITERAL(35, 422, 17), // "decodedZonePacket"
QT_MOC_LITERAL(36, 440, 14), // "processPackets"
QT_MOC_LITERAL(37, 455, 22), // "processPlaybackPackets"
QT_MOC_LITERAL(38, 478, 11), // "incPlayback"
QT_MOC_LITERAL(39, 490, 11), // "decPlayback"
QT_MOC_LITERAL(40, 502, 11), // "setPlayback"
QT_MOC_LITERAL(41, 514, 15), // "monitorIPClient"
QT_MOC_LITERAL(42, 530, 7), // "address"
QT_MOC_LITERAL(43, 538, 16), // "monitorMACClient"
QT_MOC_LITERAL(44, 555, 17), // "monitorNextClient"
QT_MOC_LITERAL(45, 573, 13), // "monitorDevice"
QT_MOC_LITERAL(46, 587, 3), // "dev"
QT_MOC_LITERAL(47, 591, 16), // "session_tracking"
QT_MOC_LITERAL(48, 608, 6), // "enable"
QT_MOC_LITERAL(49, 615, 15), // "setArqSeqGiveUp"
QT_MOC_LITERAL(50, 631, 6), // "giveUp"
QT_MOC_LITERAL(51, 638, 11), // "setRealtime"
QT_MOC_LITERAL(52, 650, 3), // "val"
QT_MOC_LITERAL(53, 654, 18), // "dispatchSessionKey"
QT_MOC_LITERAL(54, 673, 8), // "uint32_t"
QT_MOC_LITERAL(55, 682, 9), // "sessionId"
QT_MOC_LITERAL(56, 692, 10), // "EQStreamID"
QT_MOC_LITERAL(57, 703, 8), // "streamid"
QT_MOC_LITERAL(58, 712, 10), // "sessionKey"
QT_MOC_LITERAL(59, 723, 11), // "closeStream"
QT_MOC_LITERAL(60, 735, 8), // "streamId"
QT_MOC_LITERAL(61, 744, 17), // "unlatchClientPort"
QT_MOC_LITERAL(62, 762, 12), // "lockOnClient"
QT_MOC_LITERAL(63, 775, 10), // "serverPort"
QT_MOC_LITERAL(64, 786, 10), // "clientPort"
QT_MOC_LITERAL(65, 797, 10), // "clientAddr"
QT_MOC_LITERAL(66, 808, 13), // "resetEQPacket"
QT_MOC_LITERAL(67, 822, 21), // "dispatchWorldChatData"
QT_MOC_LITERAL(68, 844, 8), // "uint8_t*"
QT_MOC_LITERAL(69, 853, 9) // "direction"

    },
    "EQPacket\0cacheSize\0\0seqReceive\0seqExpect\0"
    "numPacket\0maxLength\0resetPacket\0"
    "playbackSpeedChanged\0clientChanged\0"
    "in_addr_t\0clientPortLatched\0in_port_t\0"
    "serverPortLatched\0sessionTrackingChanged\0"
    "uint8_t\0toggle_session_tracking\0"
    "filterChanged\0stsMessage\0newPacket\0"
    "EQUDPIPPacketFormat\0packet\0rawWorldPacket\0"
    "const uint8_t*\0data\0size_t\0len\0dir\0"
    "uint16_t\0opcode\0decodedWorldPacket\0"
    "const EQPacketOPCode*\0opcodeEntry\0"
    "unknown\0rawZonePacket\0decodedZonePacket\0"
    "processPackets\0processPlaybackPackets\0"
    "incPlayback\0decPlayback\0setPlayback\0"
    "monitorIPClient\0address\0monitorMACClient\0"
    "monitorNextClient\0monitorDevice\0dev\0"
    "session_tracking\0enable\0setArqSeqGiveUp\0"
    "giveUp\0setRealtime\0val\0dispatchSessionKey\0"
    "uint32_t\0sessionId\0EQStreamID\0streamid\0"
    "sessionKey\0closeStream\0streamId\0"
    "unlatchClientPort\0lockOnClient\0"
    "serverPort\0clientPort\0clientAddr\0"
    "resetEQPacket\0dispatchWorldChatData\0"
    "uint8_t*\0direction"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_EQPacket[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
      41,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
      22,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    2,  219,    2, 0x06 /* Public */,
       3,    2,  224,    2, 0x06 /* Public */,
       4,    2,  229,    2, 0x06 /* Public */,
       5,    2,  234,    2, 0x06 /* Public */,
       6,    2,  239,    2, 0x06 /* Public */,
       7,    2,  244,    2, 0x06 /* Public */,
       8,    1,  249,    2, 0x06 /* Public */,
       9,    1,  252,    2, 0x06 /* Public */,
      11,    1,  255,    2, 0x06 /* Public */,
      13,    1,  258,    2, 0x06 /* Public */,
      14,    1,  261,    2, 0x06 /* Public */,
      16,    1,  264,    2, 0x06 /* Public */,
      17,    0,  267,    2, 0x06 /* Public */,
      18,    2,  268,    2, 0x06 /* Public */,
      18,    1,  273,    2, 0x26 /* Public | MethodCloned */,
      19,    1,  276,    2, 0x06 /* Public */,
      22,    4,  279,    2, 0x06 /* Public */,
      30,    5,  288,    2, 0x06 /* Public */,
      30,    6,  299,    2, 0x06 /* Public */,
      34,    4,  312,    2, 0x06 /* Public */,
      35,    5,  321,    2, 0x06 /* Public */,
      35,    6,  332,    2, 0x06 /* Public */,

 // slots: name, argc, parameters, tag, flags
      36,    0,  345,    2, 0x0a /* Public */,
      37,    0,  346,    2, 0x0a /* Public */,
      38,    0,  347,    2, 0x0a /* Public */,
      39,    0,  348,    2, 0x0a /* Public */,
      40,    1,  349,    2, 0x0a /* Public */,
      41,    1,  352,    2, 0x0a /* Public */,
      43,    1,  355,    2, 0x0a /* Public */,
      44,    0,  358,    2, 0x0a /* Public */,
      45,    1,  359,    2, 0x0a /* Public */,
      47,    1,  362,    2, 0x0a /* Public */,
      49,    1,  365,    2, 0x0a /* Public */,
      51,    1,  368,    2, 0x0a /* Public */,
      53,    3,  371,    2, 0x0a /* Public */,
      59,    2,  378,    2, 0x09 /* Protected */,
      61,    0,  383,    2, 0x09 /* Protected */,
      62,    3,  384,    2, 0x09 /* Protected */,
      66,    0,  391,    2, 0x09 /* Protected */,
      67,    3,  392,    2, 0x09 /* Protected */,
      67,    2,  399,    2, 0x29 /* Protected | MethodCloned */,

 // signals: parameters
    QMetaType::Void, QMetaType::Int, QMetaType::Int,    2,    2,
    QMetaType::Void, QMetaType::Int, QMetaType::Int,    2,    2,
    QMetaType::Void, QMetaType::Int, QMetaType::Int,    2,    2,
    QMetaType::Void, QMetaType::Int, QMetaType::Int,    2,    2,
    QMetaType::Void, QMetaType::Int, QMetaType::Int,    2,    2,
    QMetaType::Void, QMetaType::Int, QMetaType::Int,    2,    2,
    QMetaType::Void, QMetaType::Int,    2,
    QMetaType::Void, 0x80000000 | 10,    2,
    QMetaType::Void, 0x80000000 | 12,    2,
    QMetaType::Void, 0x80000000 | 12,    2,
    QMetaType::Void, 0x80000000 | 15,    2,
    QMetaType::Void, QMetaType::Bool,    2,
    QMetaType::Void,
    QMetaType::Void, QMetaType::QString, QMetaType::Int,    2,    2,
    QMetaType::Void, QMetaType::QString,    2,
    QMetaType::Void, 0x80000000 | 20,   21,
    QMetaType::Void, 0x80000000 | 23, 0x80000000 | 25, 0x80000000 | 15, 0x80000000 | 28,   24,   26,   27,   29,
    QMetaType::Void, 0x80000000 | 23, 0x80000000 | 25, 0x80000000 | 15, 0x80000000 | 28, 0x80000000 | 31,   24,   26,   27,   29,   32,
    QMetaType::Void, 0x80000000 | 23, 0x80000000 | 25, 0x80000000 | 15, 0x80000000 | 28, 0x80000000 | 31, QMetaType::Bool,   24,   26,   27,   29,   32,   33,
    QMetaType::Void, 0x80000000 | 23, 0x80000000 | 25, 0x80000000 | 15, 0x80000000 | 28,   24,   26,   27,   29,
    QMetaType::Void, 0x80000000 | 23, 0x80000000 | 25, 0x80000000 | 15, 0x80000000 | 28, 0x80000000 | 31,   24,   26,   27,   29,   32,
    QMetaType::Void, 0x80000000 | 23, 0x80000000 | 25, 0x80000000 | 15, 0x80000000 | 28, 0x80000000 | 31, QMetaType::Bool,   24,   26,   27,   29,   32,   33,

 // slots: parameters
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void, QMetaType::Int,    2,
    QMetaType::Void, QMetaType::QString,   42,
    QMetaType::Void, QMetaType::QString,   42,
    QMetaType::Void,
    QMetaType::Void, QMetaType::QString,   46,
    QMetaType::Void, QMetaType::Bool,   48,
    QMetaType::Void, 0x80000000 | 28,   50,
    QMetaType::Void, QMetaType::Bool,   52,
    QMetaType::Void, 0x80000000 | 54, 0x80000000 | 56, 0x80000000 | 54,   55,   57,   58,
    QMetaType::Void, 0x80000000 | 54, 0x80000000 | 56,   55,   60,
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 12, 0x80000000 | 12, 0x80000000 | 10,   63,   64,   65,
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 25, 0x80000000 | 68, 0x80000000 | 15,   26,   24,   69,
    QMetaType::Void, 0x80000000 | 25, 0x80000000 | 68,   26,   24,

       0        // eod
};

void EQPacket::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<EQPacket *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->cacheSize((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 1: _t->seqReceive((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 2: _t->seqExpect((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 3: _t->numPacket((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 4: _t->maxLength((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 5: _t->resetPacket((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 6: _t->playbackSpeedChanged((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 7: _t->clientChanged((*reinterpret_cast< in_addr_t(*)>(_a[1]))); break;
        case 8: _t->clientPortLatched((*reinterpret_cast< in_port_t(*)>(_a[1]))); break;
        case 9: _t->serverPortLatched((*reinterpret_cast< in_port_t(*)>(_a[1]))); break;
        case 10: _t->sessionTrackingChanged((*reinterpret_cast< uint8_t(*)>(_a[1]))); break;
        case 11: _t->toggle_session_tracking((*reinterpret_cast< bool(*)>(_a[1]))); break;
        case 12: _t->filterChanged(); break;
        case 13: _t->stsMessage((*reinterpret_cast< const QString(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 14: _t->stsMessage((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 15: _t->newPacket((*reinterpret_cast< const EQUDPIPPacketFormat(*)>(_a[1]))); break;
        case 16: _t->rawWorldPacket((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4]))); break;
        case 17: _t->decodedWorldPacket((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4])),(*reinterpret_cast< const EQPacketOPCode*(*)>(_a[5]))); break;
        case 18: _t->decodedWorldPacket((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4])),(*reinterpret_cast< const EQPacketOPCode*(*)>(_a[5])),(*reinterpret_cast< bool(*)>(_a[6]))); break;
        case 19: _t->rawZonePacket((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4]))); break;
        case 20: _t->decodedZonePacket((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4])),(*reinterpret_cast< const EQPacketOPCode*(*)>(_a[5]))); break;
        case 21: _t->decodedZonePacket((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4])),(*reinterpret_cast< const EQPacketOPCode*(*)>(_a[5])),(*reinterpret_cast< bool(*)>(_a[6]))); break;
        case 22: _t->processPackets(); break;
        case 23: _t->processPlaybackPackets(); break;
        case 24: _t->incPlayback(); break;
        case 25: _t->decPlayback(); break;
        case 26: _t->setPlayback((*reinterpret_cast< int(*)>(_a[1]))); break;
        case 27: _t->monitorIPClient((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 28: _t->monitorMACClient((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 29: _t->monitorNextClient(); break;
        case 30: _t->monitorDevice((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 31: _t->session_tracking((*reinterpret_cast< bool(*)>(_a[1]))); break;
        case 32: _t->setArqSeqGiveUp((*reinterpret_cast< uint16_t(*)>(_a[1]))); break;
        case 33: _t->setRealtime((*reinterpret_cast< bool(*)>(_a[1]))); break;
        case 34: _t->dispatchSessionKey((*reinterpret_cast< uint32_t(*)>(_a[1])),(*reinterpret_cast< EQStreamID(*)>(_a[2])),(*reinterpret_cast< uint32_t(*)>(_a[3]))); break;
        case 35: _t->closeStream((*reinterpret_cast< uint32_t(*)>(_a[1])),(*reinterpret_cast< EQStreamID(*)>(_a[2]))); break;
        case 36: _t->unlatchClientPort(); break;
        case 37: _t->lockOnClient((*reinterpret_cast< in_port_t(*)>(_a[1])),(*reinterpret_cast< in_port_t(*)>(_a[2])),(*reinterpret_cast< in_addr_t(*)>(_a[3]))); break;
        case 38: _t->resetEQPacket(); break;
        case 39: _t->dispatchWorldChatData((*reinterpret_cast< size_t(*)>(_a[1])),(*reinterpret_cast< uint8_t*(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 40: _t->dispatchWorldChatData((*reinterpret_cast< size_t(*)>(_a[1])),(*reinterpret_cast< uint8_t*(*)>(_a[2]))); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (EQPacket::*)(int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::cacheSize)) {
                *result = 0;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::seqReceive)) {
                *result = 1;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::seqExpect)) {
                *result = 2;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::numPacket)) {
                *result = 3;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::maxLength)) {
                *result = 4;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::resetPacket)) {
                *result = 5;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::playbackSpeedChanged)) {
                *result = 6;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(in_addr_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::clientChanged)) {
                *result = 7;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(in_port_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::clientPortLatched)) {
                *result = 8;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(in_port_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::serverPortLatched)) {
                *result = 9;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(uint8_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::sessionTrackingChanged)) {
                *result = 10;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(bool );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::toggle_session_tracking)) {
                *result = 11;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)();
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::filterChanged)) {
                *result = 12;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(const QString & , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::stsMessage)) {
                *result = 13;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(const EQUDPIPPacketFormat & );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::newPacket)) {
                *result = 15;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(const uint8_t * , size_t , uint8_t , uint16_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::rawWorldPacket)) {
                *result = 16;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(const uint8_t * , size_t , uint8_t , uint16_t , const EQPacketOPCode * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::decodedWorldPacket)) {
                *result = 17;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(const uint8_t * , size_t , uint8_t , uint16_t , const EQPacketOPCode * , bool );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::decodedWorldPacket)) {
                *result = 18;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(const uint8_t * , size_t , uint8_t , uint16_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::rawZonePacket)) {
                *result = 19;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(const uint8_t * , size_t , uint8_t , uint16_t , const EQPacketOPCode * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::decodedZonePacket)) {
                *result = 20;
                return;
            }
        }
        {
            using _t = void (EQPacket::*)(const uint8_t * , size_t , uint8_t , uint16_t , const EQPacketOPCode * , bool );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacket::decodedZonePacket)) {
                *result = 21;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject EQPacket::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_EQPacket.data,
    qt_meta_data_EQPacket,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *EQPacket::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *EQPacket::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_EQPacket.stringdata0))
        return static_cast<void*>(this);
    return QObject::qt_metacast(_clname);
}

int EQPacket::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 41)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 41;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 41)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 41;
    }
    return _id;
}

// SIGNAL 0
void EQPacket::cacheSize(int _t1, int _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 0, _a);
}

// SIGNAL 1
void EQPacket::seqReceive(int _t1, int _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 1, _a);
}

// SIGNAL 2
void EQPacket::seqExpect(int _t1, int _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 2, _a);
}

// SIGNAL 3
void EQPacket::numPacket(int _t1, int _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 3, _a);
}

// SIGNAL 4
void EQPacket::maxLength(int _t1, int _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 4, _a);
}

// SIGNAL 5
void EQPacket::resetPacket(int _t1, int _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 5, _a);
}

// SIGNAL 6
void EQPacket::playbackSpeedChanged(int _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 6, _a);
}

// SIGNAL 7
void EQPacket::clientChanged(in_addr_t _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 7, _a);
}

// SIGNAL 8
void EQPacket::clientPortLatched(in_port_t _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 8, _a);
}

// SIGNAL 9
void EQPacket::serverPortLatched(in_port_t _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 9, _a);
}

// SIGNAL 10
void EQPacket::sessionTrackingChanged(uint8_t _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 10, _a);
}

// SIGNAL 11
void EQPacket::toggle_session_tracking(bool _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 11, _a);
}

// SIGNAL 12
void EQPacket::filterChanged()
{
    QMetaObject::activate(this, &staticMetaObject, 12, nullptr);
}

// SIGNAL 13
void EQPacket::stsMessage(const QString & _t1, int _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 13, _a);
}

// SIGNAL 15
void EQPacket::newPacket(const EQUDPIPPacketFormat & _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 15, _a);
}

// SIGNAL 16
void EQPacket::rawWorldPacket(const uint8_t * _t1, size_t _t2, uint8_t _t3, uint16_t _t4)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t4))) };
    QMetaObject::activate(this, &staticMetaObject, 16, _a);
}

// SIGNAL 17
void EQPacket::decodedWorldPacket(const uint8_t * _t1, size_t _t2, uint8_t _t3, uint16_t _t4, const EQPacketOPCode * _t5)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t4))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t5))) };
    QMetaObject::activate(this, &staticMetaObject, 17, _a);
}

// SIGNAL 18
void EQPacket::decodedWorldPacket(const uint8_t * _t1, size_t _t2, uint8_t _t3, uint16_t _t4, const EQPacketOPCode * _t5, bool _t6)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t4))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t5))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t6))) };
    QMetaObject::activate(this, &staticMetaObject, 18, _a);
}

// SIGNAL 19
void EQPacket::rawZonePacket(const uint8_t * _t1, size_t _t2, uint8_t _t3, uint16_t _t4)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t4))) };
    QMetaObject::activate(this, &staticMetaObject, 19, _a);
}

// SIGNAL 20
void EQPacket::decodedZonePacket(const uint8_t * _t1, size_t _t2, uint8_t _t3, uint16_t _t4, const EQPacketOPCode * _t5)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t4))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t5))) };
    QMetaObject::activate(this, &staticMetaObject, 20, _a);
}

// SIGNAL 21
void EQPacket::decodedZonePacket(const uint8_t * _t1, size_t _t2, uint8_t _t3, uint16_t _t4, const EQPacketOPCode * _t5, bool _t6)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t4))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t5))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t6))) };
    QMetaObject::activate(this, &staticMetaObject, 21, _a);
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
