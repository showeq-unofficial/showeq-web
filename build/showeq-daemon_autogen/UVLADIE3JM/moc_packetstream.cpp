/****************************************************************************
** Meta object code from reading C++ file 'packetstream.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/packetstream.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'packetstream.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_EQPacketStream_t {
    QByteArrayData data[38];
    char stringdata0[397];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_EQPacketStream_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_EQPacketStream_t qt_meta_stringdata_EQPacketStream = {
    {
QT_MOC_LITERAL(0, 0, 14), // "EQPacketStream"
QT_MOC_LITERAL(1, 15, 9), // "rawPacket"
QT_MOC_LITERAL(2, 25, 0), // ""
QT_MOC_LITERAL(3, 26, 14), // "const uint8_t*"
QT_MOC_LITERAL(4, 41, 4), // "data"
QT_MOC_LITERAL(5, 46, 6), // "size_t"
QT_MOC_LITERAL(6, 53, 3), // "len"
QT_MOC_LITERAL(7, 57, 7), // "uint8_t"
QT_MOC_LITERAL(8, 65, 3), // "dir"
QT_MOC_LITERAL(9, 69, 8), // "uint16_t"
QT_MOC_LITERAL(10, 78, 6), // "opcode"
QT_MOC_LITERAL(11, 85, 13), // "decodedPacket"
QT_MOC_LITERAL(12, 99, 21), // "const EQPacketOPCode*"
QT_MOC_LITERAL(13, 121, 11), // "opcodeEntry"
QT_MOC_LITERAL(14, 133, 7), // "unknown"
QT_MOC_LITERAL(15, 141, 7), // "closing"
QT_MOC_LITERAL(16, 149, 8), // "uint32_t"
QT_MOC_LITERAL(17, 158, 9), // "sessionId"
QT_MOC_LITERAL(18, 168, 10), // "EQStreamID"
QT_MOC_LITERAL(19, 179, 8), // "streamId"
QT_MOC_LITERAL(20, 188, 22), // "sessionTrackingChanged"
QT_MOC_LITERAL(21, 211, 12), // "lockOnClient"
QT_MOC_LITERAL(22, 224, 9), // "in_port_t"
QT_MOC_LITERAL(23, 234, 10), // "serverPort"
QT_MOC_LITERAL(24, 245, 10), // "clientPort"
QT_MOC_LITERAL(25, 256, 9), // "in_addr_t"
QT_MOC_LITERAL(26, 266, 10), // "clientAddr"
QT_MOC_LITERAL(27, 277, 10), // "sessionKey"
QT_MOC_LITERAL(28, 288, 8), // "streadid"
QT_MOC_LITERAL(29, 297, 9), // "cacheSize"
QT_MOC_LITERAL(30, 307, 10), // "seqReceive"
QT_MOC_LITERAL(31, 318, 9), // "seqExpect"
QT_MOC_LITERAL(32, 328, 9), // "numPacket"
QT_MOC_LITERAL(33, 338, 11), // "resetPacket"
QT_MOC_LITERAL(34, 350, 9), // "maxLength"
QT_MOC_LITERAL(35, 360, 12), // "handlePacket"
QT_MOC_LITERAL(36, 373, 20), // "EQUDPIPPacketFormat&"
QT_MOC_LITERAL(37, 394, 2) // "pf"

    },
    "EQPacketStream\0rawPacket\0\0const uint8_t*\0"
    "data\0size_t\0len\0uint8_t\0dir\0uint16_t\0"
    "opcode\0decodedPacket\0const EQPacketOPCode*\0"
    "opcodeEntry\0unknown\0closing\0uint32_t\0"
    "sessionId\0EQStreamID\0streamId\0"
    "sessionTrackingChanged\0lockOnClient\0"
    "in_port_t\0serverPort\0clientPort\0"
    "in_addr_t\0clientAddr\0sessionKey\0"
    "streadid\0cacheSize\0seqReceive\0seqExpect\0"
    "numPacket\0resetPacket\0maxLength\0"
    "handlePacket\0EQUDPIPPacketFormat&\0pf"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_EQPacketStream[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
      14,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
      13,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    4,   84,    2, 0x06 /* Public */,
      11,    5,   93,    2, 0x06 /* Public */,
      11,    6,  104,    2, 0x06 /* Public */,
      15,    2,  117,    2, 0x06 /* Public */,
      20,    1,  122,    2, 0x06 /* Public */,
      21,    3,  125,    2, 0x06 /* Public */,
      27,    3,  132,    2, 0x06 /* Public */,
      29,    2,  139,    2, 0x06 /* Public */,
      30,    2,  144,    2, 0x06 /* Public */,
      31,    2,  149,    2, 0x06 /* Public */,
      32,    2,  154,    2, 0x06 /* Public */,
      33,    2,  159,    2, 0x06 /* Public */,
      34,    2,  164,    2, 0x06 /* Public */,

 // slots: name, argc, parameters, tag, flags
      35,    1,  169,    2, 0x0a /* Public */,

 // signals: parameters
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 7, 0x80000000 | 9,    4,    6,    8,   10,
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 7, 0x80000000 | 9, 0x80000000 | 12,    4,    6,    8,   10,   13,
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 7, 0x80000000 | 9, 0x80000000 | 12, QMetaType::Bool,    4,    6,    8,   10,   13,   14,
    QMetaType::Void, 0x80000000 | 16, 0x80000000 | 18,   17,   19,
    QMetaType::Void, 0x80000000 | 7,    2,
    QMetaType::Void, 0x80000000 | 22, 0x80000000 | 22, 0x80000000 | 25,   23,   24,   26,
    QMetaType::Void, 0x80000000 | 16, 0x80000000 | 18, 0x80000000 | 16,   17,   28,   27,
    QMetaType::Void, QMetaType::Int, QMetaType::Int,    2,    2,
    QMetaType::Void, QMetaType::Int, QMetaType::Int,    2,    2,
    QMetaType::Void, QMetaType::Int, QMetaType::Int,    2,    2,
    QMetaType::Void, QMetaType::Int, QMetaType::Int,    2,    2,
    QMetaType::Void, QMetaType::Int, QMetaType::Int,    2,    2,
    QMetaType::Void, QMetaType::Int, QMetaType::Int,    2,    2,

 // slots: parameters
    QMetaType::Void, 0x80000000 | 36,   37,

       0        // eod
};

void EQPacketStream::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<EQPacketStream *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->rawPacket((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4]))); break;
        case 1: _t->decodedPacket((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4])),(*reinterpret_cast< const EQPacketOPCode*(*)>(_a[5]))); break;
        case 2: _t->decodedPacket((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4])),(*reinterpret_cast< const EQPacketOPCode*(*)>(_a[5])),(*reinterpret_cast< bool(*)>(_a[6]))); break;
        case 3: _t->closing((*reinterpret_cast< uint32_t(*)>(_a[1])),(*reinterpret_cast< EQStreamID(*)>(_a[2]))); break;
        case 4: _t->sessionTrackingChanged((*reinterpret_cast< uint8_t(*)>(_a[1]))); break;
        case 5: _t->lockOnClient((*reinterpret_cast< in_port_t(*)>(_a[1])),(*reinterpret_cast< in_port_t(*)>(_a[2])),(*reinterpret_cast< in_addr_t(*)>(_a[3]))); break;
        case 6: _t->sessionKey((*reinterpret_cast< uint32_t(*)>(_a[1])),(*reinterpret_cast< EQStreamID(*)>(_a[2])),(*reinterpret_cast< uint32_t(*)>(_a[3]))); break;
        case 7: _t->cacheSize((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 8: _t->seqReceive((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 9: _t->seqExpect((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 10: _t->numPacket((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 11: _t->resetPacket((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 12: _t->maxLength((*reinterpret_cast< int(*)>(_a[1])),(*reinterpret_cast< int(*)>(_a[2]))); break;
        case 13: _t->handlePacket((*reinterpret_cast< EQUDPIPPacketFormat(*)>(_a[1]))); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (EQPacketStream::*)(const uint8_t * , size_t , uint8_t , uint16_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacketStream::rawPacket)) {
                *result = 0;
                return;
            }
        }
        {
            using _t = void (EQPacketStream::*)(const uint8_t * , size_t , uint8_t , uint16_t , const EQPacketOPCode * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacketStream::decodedPacket)) {
                *result = 1;
                return;
            }
        }
        {
            using _t = void (EQPacketStream::*)(const uint8_t * , size_t , uint8_t , uint16_t , const EQPacketOPCode * , bool );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacketStream::decodedPacket)) {
                *result = 2;
                return;
            }
        }
        {
            using _t = void (EQPacketStream::*)(uint32_t , EQStreamID );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacketStream::closing)) {
                *result = 3;
                return;
            }
        }
        {
            using _t = void (EQPacketStream::*)(uint8_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacketStream::sessionTrackingChanged)) {
                *result = 4;
                return;
            }
        }
        {
            using _t = void (EQPacketStream::*)(in_port_t , in_port_t , in_addr_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacketStream::lockOnClient)) {
                *result = 5;
                return;
            }
        }
        {
            using _t = void (EQPacketStream::*)(uint32_t , EQStreamID , uint32_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacketStream::sessionKey)) {
                *result = 6;
                return;
            }
        }
        {
            using _t = void (EQPacketStream::*)(int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacketStream::cacheSize)) {
                *result = 7;
                return;
            }
        }
        {
            using _t = void (EQPacketStream::*)(int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacketStream::seqReceive)) {
                *result = 8;
                return;
            }
        }
        {
            using _t = void (EQPacketStream::*)(int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacketStream::seqExpect)) {
                *result = 9;
                return;
            }
        }
        {
            using _t = void (EQPacketStream::*)(int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacketStream::numPacket)) {
                *result = 10;
                return;
            }
        }
        {
            using _t = void (EQPacketStream::*)(int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacketStream::resetPacket)) {
                *result = 11;
                return;
            }
        }
        {
            using _t = void (EQPacketStream::*)(int , int );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&EQPacketStream::maxLength)) {
                *result = 12;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject EQPacketStream::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_EQPacketStream.data,
    qt_meta_data_EQPacketStream,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *EQPacketStream::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *EQPacketStream::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_EQPacketStream.stringdata0))
        return static_cast<void*>(this);
    return QObject::qt_metacast(_clname);
}

int EQPacketStream::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 14)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 14;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 14)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 14;
    }
    return _id;
}

// SIGNAL 0
void EQPacketStream::rawPacket(const uint8_t * _t1, size_t _t2, uint8_t _t3, uint16_t _t4)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t4))) };
    QMetaObject::activate(this, &staticMetaObject, 0, _a);
}

// SIGNAL 1
void EQPacketStream::decodedPacket(const uint8_t * _t1, size_t _t2, uint8_t _t3, uint16_t _t4, const EQPacketOPCode * _t5)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t4))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t5))) };
    QMetaObject::activate(this, &staticMetaObject, 1, _a);
}

// SIGNAL 2
void EQPacketStream::decodedPacket(const uint8_t * _t1, size_t _t2, uint8_t _t3, uint16_t _t4, const EQPacketOPCode * _t5, bool _t6)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t4))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t5))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t6))) };
    QMetaObject::activate(this, &staticMetaObject, 2, _a);
}

// SIGNAL 3
void EQPacketStream::closing(uint32_t _t1, EQStreamID _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 3, _a);
}

// SIGNAL 4
void EQPacketStream::sessionTrackingChanged(uint8_t _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 4, _a);
}

// SIGNAL 5
void EQPacketStream::lockOnClient(in_port_t _t1, in_port_t _t2, in_addr_t _t3)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))) };
    QMetaObject::activate(this, &staticMetaObject, 5, _a);
}

// SIGNAL 6
void EQPacketStream::sessionKey(uint32_t _t1, EQStreamID _t2, uint32_t _t3)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))) };
    QMetaObject::activate(this, &staticMetaObject, 6, _a);
}

// SIGNAL 7
void EQPacketStream::cacheSize(int _t1, int _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 7, _a);
}

// SIGNAL 8
void EQPacketStream::seqReceive(int _t1, int _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 8, _a);
}

// SIGNAL 9
void EQPacketStream::seqExpect(int _t1, int _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 9, _a);
}

// SIGNAL 10
void EQPacketStream::numPacket(int _t1, int _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 10, _a);
}

// SIGNAL 11
void EQPacketStream::resetPacket(int _t1, int _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 11, _a);
}

// SIGNAL 12
void EQPacketStream::maxLength(int _t1, int _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 12, _a);
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
