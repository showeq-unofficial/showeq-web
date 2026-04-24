/****************************************************************************
** Meta object code from reading C++ file 'spawnlog.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/spawnlog.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'spawnlog.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_SpawnLog_t {
    QByteArrayData data[18];
    char stringdata0[158];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_SpawnLog_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_SpawnLog_t qt_meta_stringdata_SpawnLog = {
    {
QT_MOC_LITERAL(0, 0, 8), // "SpawnLog"
QT_MOC_LITERAL(1, 9, 10), // "logNewZone"
QT_MOC_LITERAL(2, 20, 0), // ""
QT_MOC_LITERAL(3, 21, 4), // "zone"
QT_MOC_LITERAL(4, 26, 13), // "logZoneSpawns"
QT_MOC_LITERAL(5, 40, 14), // "const uint8_t*"
QT_MOC_LITERAL(6, 55, 7), // "zspawns"
QT_MOC_LITERAL(7, 63, 6), // "size_t"
QT_MOC_LITERAL(8, 70, 3), // "len"
QT_MOC_LITERAL(9, 74, 11), // "logNewSpawn"
QT_MOC_LITERAL(10, 86, 5), // "spawn"
QT_MOC_LITERAL(11, 92, 14), // "logKilledSpawn"
QT_MOC_LITERAL(12, 107, 11), // "const Item*"
QT_MOC_LITERAL(13, 119, 4), // "item"
QT_MOC_LITERAL(14, 124, 5), // "kitem"
QT_MOC_LITERAL(15, 130, 8), // "uint16_t"
QT_MOC_LITERAL(16, 139, 3), // "kid"
QT_MOC_LITERAL(17, 143, 14) // "logDeleteSpawn"

    },
    "SpawnLog\0logNewZone\0\0zone\0logZoneSpawns\0"
    "const uint8_t*\0zspawns\0size_t\0len\0"
    "logNewSpawn\0spawn\0logKilledSpawn\0"
    "const Item*\0item\0kitem\0uint16_t\0kid\0"
    "logDeleteSpawn"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_SpawnLog[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
       6,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       0,       // signalCount

 // slots: name, argc, parameters, tag, flags
       1,    1,   44,    2, 0x0a /* Public */,
       4,    2,   47,    2, 0x0a /* Public */,
       9,    1,   52,    2, 0x0a /* Public */,
      11,    3,   55,    2, 0x0a /* Public */,
      17,    1,   62,    2, 0x0a /* Public */,
       9,    1,   65,    2, 0x0a /* Public */,

 // slots: parameters
    QMetaType::Void, QMetaType::QString,    3,
    QMetaType::Void, 0x80000000 | 5, 0x80000000 | 7,    6,    8,
    QMetaType::Void, 0x80000000 | 5,   10,
    QMetaType::Void, 0x80000000 | 12, 0x80000000 | 12, 0x80000000 | 15,   13,   14,   16,
    QMetaType::Void, 0x80000000 | 12,   10,
    QMetaType::Void, 0x80000000 | 12,   10,

       0        // eod
};

void SpawnLog::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<SpawnLog *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->logNewZone((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 1: _t->logZoneSpawns((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2]))); break;
        case 2: _t->logNewSpawn((*reinterpret_cast< const uint8_t*(*)>(_a[1]))); break;
        case 3: _t->logKilledSpawn((*reinterpret_cast< const Item*(*)>(_a[1])),(*reinterpret_cast< const Item*(*)>(_a[2])),(*reinterpret_cast< uint16_t(*)>(_a[3]))); break;
        case 4: _t->logDeleteSpawn((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 5: _t->logNewSpawn((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        default: ;
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject SpawnLog::staticMetaObject = { {
    QMetaObject::SuperData::link<SEQLogger::staticMetaObject>(),
    qt_meta_stringdata_SpawnLog.data,
    qt_meta_data_SpawnLog,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *SpawnLog::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *SpawnLog::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_SpawnLog.stringdata0))
        return static_cast<void*>(this);
    return SEQLogger::qt_metacast(_clname);
}

int SpawnLog::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = SEQLogger::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 6)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 6;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 6)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 6;
    }
    return _id;
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
