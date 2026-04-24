/****************************************************************************
** Meta object code from reading C++ file 'packetlog.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/packetlog.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'packetlog.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_PacketLog_t {
    QByteArrayData data[20];
    char stringdata0[186];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_PacketLog_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_PacketLog_t qt_meta_stringdata_PacketLog = {
    {
QT_MOC_LITERAL(0, 0, 9), // "PacketLog"
QT_MOC_LITERAL(1, 10, 10), // "logMessage"
QT_MOC_LITERAL(2, 21, 0), // ""
QT_MOC_LITERAL(3, 22, 7), // "message"
QT_MOC_LITERAL(4, 30, 7), // "logData"
QT_MOC_LITERAL(5, 38, 14), // "const uint8_t*"
QT_MOC_LITERAL(6, 53, 4), // "data"
QT_MOC_LITERAL(7, 58, 6), // "size_t"
QT_MOC_LITERAL(8, 65, 3), // "len"
QT_MOC_LITERAL(9, 69, 6), // "prefix"
QT_MOC_LITERAL(10, 76, 7), // "uint8_t"
QT_MOC_LITERAL(11, 84, 3), // "dir"
QT_MOC_LITERAL(12, 88, 8), // "uint16_t"
QT_MOC_LITERAL(13, 97, 6), // "opcode"
QT_MOC_LITERAL(14, 104, 10), // "origPrefix"
QT_MOC_LITERAL(15, 115, 21), // "const EQPacketOPCode*"
QT_MOC_LITERAL(16, 137, 11), // "opcodeEntry"
QT_MOC_LITERAL(17, 149, 19), // "EQUDPIPPacketFormat"
QT_MOC_LITERAL(18, 169, 6), // "packet"
QT_MOC_LITERAL(19, 176, 9) // "printData"

    },
    "PacketLog\0logMessage\0\0message\0logData\0"
    "const uint8_t*\0data\0size_t\0len\0prefix\0"
    "uint8_t\0dir\0uint16_t\0opcode\0origPrefix\0"
    "const EQPacketOPCode*\0opcodeEntry\0"
    "EQUDPIPPacketFormat\0packet\0printData"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_PacketLog[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
      10,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // slots: name, argc, parameters, tag, flags
       1,    1,   64,    2, 0x0a /* Public */,
       4,    3,   67,    2, 0x0a /* Public */,
       4,    2,   74,    2, 0x2a /* Public | MethodCloned */,
       4,    5,   79,    2, 0x0a /* Public */,
       4,    4,   90,    2, 0x2a /* Public | MethodCloned */,
       4,    6,   99,    2, 0x0a /* Public */,
       4,    5,  112,    2, 0x2a /* Public | MethodCloned */,
       4,    1,  123,    2, 0x0a /* Public */,
      19,    5,  126,    2, 0x0a /* Public */,
      19,    4,  137,    2, 0x2a /* Public | MethodCloned */,

 // slots: parameters
    QMetaType::Void, QMetaType::QString,    3,
    QMetaType::Void, 0x80000000 | 5, 0x80000000 | 7, QMetaType::QString,    6,    8,    9,
    QMetaType::Void, 0x80000000 | 5, 0x80000000 | 7,    6,    8,
    QMetaType::Void, 0x80000000 | 5, 0x80000000 | 7, 0x80000000 | 10, 0x80000000 | 12, QMetaType::QString,    6,    8,   11,   13,   14,
    QMetaType::Void, 0x80000000 | 5, 0x80000000 | 7, 0x80000000 | 10, 0x80000000 | 12,    6,    8,   11,   13,
    QMetaType::Void, 0x80000000 | 5, 0x80000000 | 7, 0x80000000 | 10, 0x80000000 | 12, 0x80000000 | 15, QMetaType::QString,    6,    8,   11,   13,   16,   14,
    QMetaType::Void, 0x80000000 | 5, 0x80000000 | 7, 0x80000000 | 10, 0x80000000 | 12, 0x80000000 | 15,    6,    8,   11,   13,   16,
    QMetaType::Void, 0x80000000 | 17,   18,
    QMetaType::Void, 0x80000000 | 5, 0x80000000 | 7, 0x80000000 | 10, 0x80000000 | 12, QMetaType::QString,    6,    8,   11,   13,   14,
    QMetaType::Void, 0x80000000 | 5, 0x80000000 | 7, 0x80000000 | 10, 0x80000000 | 12,    6,    8,   11,   13,

       0        // eod
};

void PacketLog::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<PacketLog *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->logMessage((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 1: _t->logData((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< const QString(*)>(_a[3]))); break;
        case 2: _t->logData((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2]))); break;
        case 3: _t->logData((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4])),(*reinterpret_cast< const QString(*)>(_a[5]))); break;
        case 4: _t->logData((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4]))); break;
        case 5: _t->logData((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4])),(*reinterpret_cast< const EQPacketOPCode*(*)>(_a[5])),(*reinterpret_cast< const QString(*)>(_a[6]))); break;
        case 6: _t->logData((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4])),(*reinterpret_cast< const EQPacketOPCode*(*)>(_a[5]))); break;
        case 7: _t->logData((*reinterpret_cast< const EQUDPIPPacketFormat(*)>(_a[1]))); break;
        case 8: _t->printData((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4])),(*reinterpret_cast< const QString(*)>(_a[5]))); break;
        case 9: _t->printData((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4]))); break;
        default: ;
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject PacketLog::staticMetaObject = { {
    QMetaObject::SuperData::link<SEQLogger::staticMetaObject>(),
    qt_meta_stringdata_PacketLog.data,
    qt_meta_data_PacketLog,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *PacketLog::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *PacketLog::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_PacketLog.stringdata0))
        return static_cast<void*>(this);
    return SEQLogger::qt_metacast(_clname);
}

int PacketLog::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = SEQLogger::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 10)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 10;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 10)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 10;
    }
    return _id;
}
struct qt_meta_stringdata_PacketStreamLog_t {
    QByteArrayData data[14];
    char stringdata0[146];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_PacketStreamLog_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_PacketStreamLog_t qt_meta_stringdata_PacketStreamLog = {
    {
QT_MOC_LITERAL(0, 0, 15), // "PacketStreamLog"
QT_MOC_LITERAL(1, 16, 15), // "rawStreamPacket"
QT_MOC_LITERAL(2, 32, 0), // ""
QT_MOC_LITERAL(3, 33, 14), // "const uint8_t*"
QT_MOC_LITERAL(4, 48, 4), // "data"
QT_MOC_LITERAL(5, 53, 6), // "size_t"
QT_MOC_LITERAL(6, 60, 3), // "len"
QT_MOC_LITERAL(7, 64, 7), // "uint8_t"
QT_MOC_LITERAL(8, 72, 3), // "dir"
QT_MOC_LITERAL(9, 76, 8), // "uint16_t"
QT_MOC_LITERAL(10, 85, 6), // "opcode"
QT_MOC_LITERAL(11, 92, 19), // "decodedStreamPacket"
QT_MOC_LITERAL(12, 112, 21), // "const EQPacketOPCode*"
QT_MOC_LITERAL(13, 134, 11) // "opcodeEntry"

    },
    "PacketStreamLog\0rawStreamPacket\0\0"
    "const uint8_t*\0data\0size_t\0len\0uint8_t\0"
    "dir\0uint16_t\0opcode\0decodedStreamPacket\0"
    "const EQPacketOPCode*\0opcodeEntry"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_PacketStreamLog[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
       2,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // slots: name, argc, parameters, tag, flags
       1,    4,   24,    2, 0x0a /* Public */,
      11,    5,   33,    2, 0x0a /* Public */,

 // slots: parameters
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 7, 0x80000000 | 9,    4,    6,    8,   10,
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 7, 0x80000000 | 9, 0x80000000 | 12,    4,    6,    8,   10,   13,

       0        // eod
};

void PacketStreamLog::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<PacketStreamLog *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->rawStreamPacket((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4]))); break;
        case 1: _t->decodedStreamPacket((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4])),(*reinterpret_cast< const EQPacketOPCode*(*)>(_a[5]))); break;
        default: ;
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject PacketStreamLog::staticMetaObject = { {
    QMetaObject::SuperData::link<PacketLog::staticMetaObject>(),
    qt_meta_stringdata_PacketStreamLog.data,
    qt_meta_data_PacketStreamLog,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *PacketStreamLog::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *PacketStreamLog::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_PacketStreamLog.stringdata0))
        return static_cast<void*>(this);
    return PacketLog::qt_metacast(_clname);
}

int PacketStreamLog::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = PacketLog::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 2)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 2;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 2)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 2;
    }
    return _id;
}
struct qt_meta_stringdata_UnknownPacketLog_t {
    QByteArrayData data[14];
    char stringdata0[126];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_UnknownPacketLog_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_UnknownPacketLog_t qt_meta_stringdata_UnknownPacketLog = {
    {
QT_MOC_LITERAL(0, 0, 16), // "UnknownPacketLog"
QT_MOC_LITERAL(1, 17, 6), // "packet"
QT_MOC_LITERAL(2, 24, 0), // ""
QT_MOC_LITERAL(3, 25, 14), // "const uint8_t*"
QT_MOC_LITERAL(4, 40, 4), // "data"
QT_MOC_LITERAL(5, 45, 6), // "size_t"
QT_MOC_LITERAL(6, 52, 3), // "len"
QT_MOC_LITERAL(7, 56, 7), // "uint8_t"
QT_MOC_LITERAL(8, 64, 3), // "dir"
QT_MOC_LITERAL(9, 68, 8), // "uint16_t"
QT_MOC_LITERAL(10, 77, 6), // "opcode"
QT_MOC_LITERAL(11, 84, 21), // "const EQPacketOPCode*"
QT_MOC_LITERAL(12, 106, 11), // "opcodeEntry"
QT_MOC_LITERAL(13, 118, 7) // "unknown"

    },
    "UnknownPacketLog\0packet\0\0const uint8_t*\0"
    "data\0size_t\0len\0uint8_t\0dir\0uint16_t\0"
    "opcode\0const EQPacketOPCode*\0opcodeEntry\0"
    "unknown"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_UnknownPacketLog[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
       1,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // slots: name, argc, parameters, tag, flags
       1,    6,   19,    2, 0x0a /* Public */,

 // slots: parameters
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 7, 0x80000000 | 9, 0x80000000 | 11, QMetaType::Bool,    4,    6,    8,   10,   12,   13,

       0        // eod
};

void UnknownPacketLog::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<UnknownPacketLog *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->packet((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4])),(*reinterpret_cast< const EQPacketOPCode*(*)>(_a[5])),(*reinterpret_cast< bool(*)>(_a[6]))); break;
        default: ;
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject UnknownPacketLog::staticMetaObject = { {
    QMetaObject::SuperData::link<PacketLog::staticMetaObject>(),
    qt_meta_stringdata_UnknownPacketLog.data,
    qt_meta_data_UnknownPacketLog,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *UnknownPacketLog::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *UnknownPacketLog::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_UnknownPacketLog.stringdata0))
        return static_cast<void*>(this);
    return PacketLog::qt_metacast(_clname);
}

int UnknownPacketLog::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = PacketLog::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 1)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 1;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 1)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 1;
    }
    return _id;
}
struct qt_meta_stringdata_OPCodeMonitorPacketLog_t {
    QByteArrayData data[14];
    char stringdata0[132];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_OPCodeMonitorPacketLog_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_OPCodeMonitorPacketLog_t qt_meta_stringdata_OPCodeMonitorPacketLog = {
    {
QT_MOC_LITERAL(0, 0, 22), // "OPCodeMonitorPacketLog"
QT_MOC_LITERAL(1, 23, 6), // "packet"
QT_MOC_LITERAL(2, 30, 0), // ""
QT_MOC_LITERAL(3, 31, 14), // "const uint8_t*"
QT_MOC_LITERAL(4, 46, 4), // "data"
QT_MOC_LITERAL(5, 51, 6), // "size_t"
QT_MOC_LITERAL(6, 58, 3), // "len"
QT_MOC_LITERAL(7, 62, 7), // "uint8_t"
QT_MOC_LITERAL(8, 70, 3), // "dir"
QT_MOC_LITERAL(9, 74, 8), // "uint16_t"
QT_MOC_LITERAL(10, 83, 6), // "opcode"
QT_MOC_LITERAL(11, 90, 21), // "const EQPacketOPCode*"
QT_MOC_LITERAL(12, 112, 11), // "opcodeEntry"
QT_MOC_LITERAL(13, 124, 7) // "unknown"

    },
    "OPCodeMonitorPacketLog\0packet\0\0"
    "const uint8_t*\0data\0size_t\0len\0uint8_t\0"
    "dir\0uint16_t\0opcode\0const EQPacketOPCode*\0"
    "opcodeEntry\0unknown"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_OPCodeMonitorPacketLog[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
       1,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // slots: name, argc, parameters, tag, flags
       1,    6,   19,    2, 0x0a /* Public */,

 // slots: parameters
    QMetaType::Void, 0x80000000 | 3, 0x80000000 | 5, 0x80000000 | 7, 0x80000000 | 9, 0x80000000 | 11, QMetaType::Bool,    4,    6,    8,   10,   12,   13,

       0        // eod
};

void OPCodeMonitorPacketLog::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<OPCodeMonitorPacketLog *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->packet((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3])),(*reinterpret_cast< uint16_t(*)>(_a[4])),(*reinterpret_cast< const EQPacketOPCode*(*)>(_a[5])),(*reinterpret_cast< bool(*)>(_a[6]))); break;
        default: ;
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject OPCodeMonitorPacketLog::staticMetaObject = { {
    QMetaObject::SuperData::link<PacketLog::staticMetaObject>(),
    qt_meta_stringdata_OPCodeMonitorPacketLog.data,
    qt_meta_data_OPCodeMonitorPacketLog,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *OPCodeMonitorPacketLog::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *OPCodeMonitorPacketLog::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_OPCodeMonitorPacketLog.stringdata0))
        return static_cast<void*>(this);
    return PacketLog::qt_metacast(_clname);
}

int OPCodeMonitorPacketLog::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = PacketLog::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 1)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 1;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 1)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 1;
    }
    return _id;
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
