/****************************************************************************
** Meta object code from reading C++ file 'zonemgr.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/zonemgr.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'zonemgr.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_ZoneMgr_t {
    QByteArrayData data[33];
    char stringdata0[395];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_ZoneMgr_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_ZoneMgr_t qt_meta_stringdata_ZoneMgr = {
    {
QT_MOC_LITERAL(0, 0, 7), // "ZoneMgr"
QT_MOC_LITERAL(1, 8, 9), // "zoneBegin"
QT_MOC_LITERAL(2, 18, 0), // ""
QT_MOC_LITERAL(3, 19, 13), // "shortZoneName"
QT_MOC_LITERAL(4, 33, 28), // "const ClientZoneEntryStruct*"
QT_MOC_LITERAL(5, 62, 7), // "zsentry"
QT_MOC_LITERAL(6, 70, 6), // "size_t"
QT_MOC_LITERAL(7, 77, 3), // "len"
QT_MOC_LITERAL(8, 81, 7), // "uint8_t"
QT_MOC_LITERAL(9, 89, 3), // "dir"
QT_MOC_LITERAL(10, 93, 13), // "playerProfile"
QT_MOC_LITERAL(11, 107, 24), // "const charProfileStruct*"
QT_MOC_LITERAL(12, 132, 6), // "player"
QT_MOC_LITERAL(13, 139, 11), // "zoneChanged"
QT_MOC_LITERAL(14, 151, 23), // "const zoneChangeStruct*"
QT_MOC_LITERAL(15, 175, 7), // "zoneEnd"
QT_MOC_LITERAL(16, 183, 12), // "longZoneName"
QT_MOC_LITERAL(17, 196, 13), // "saveZoneState"
QT_MOC_LITERAL(18, 210, 16), // "restoreZoneState"
QT_MOC_LITERAL(19, 227, 15), // "zoneEntryClient"
QT_MOC_LITERAL(20, 243, 14), // "const uint8_t*"
QT_MOC_LITERAL(21, 258, 10), // "zonePlayer"
QT_MOC_LITERAL(22, 269, 10), // "zoneChange"
QT_MOC_LITERAL(23, 280, 7), // "zoneNew"
QT_MOC_LITERAL(24, 288, 10), // "zonePoints"
QT_MOC_LITERAL(25, 299, 2), // "zp"
QT_MOC_LITERAL(26, 302, 17), // "dynamicZonePoints"
QT_MOC_LITERAL(27, 320, 4), // "data"
QT_MOC_LITERAL(28, 325, 15), // "dynamicZoneInfo"
QT_MOC_LITERAL(29, 341, 17), // "fillProfileStruct"
QT_MOC_LITERAL(30, 359, 7), // "int32_t"
QT_MOC_LITERAL(31, 367, 18), // "charProfileStruct*"
QT_MOC_LITERAL(32, 386, 8) // "checkLen"

    },
    "ZoneMgr\0zoneBegin\0\0shortZoneName\0"
    "const ClientZoneEntryStruct*\0zsentry\0"
    "size_t\0len\0uint8_t\0dir\0playerProfile\0"
    "const charProfileStruct*\0player\0"
    "zoneChanged\0const zoneChangeStruct*\0"
    "zoneEnd\0longZoneName\0saveZoneState\0"
    "restoreZoneState\0zoneEntryClient\0"
    "const uint8_t*\0zonePlayer\0zoneChange\0"
    "zoneNew\0zonePoints\0zp\0dynamicZonePoints\0"
    "data\0dynamicZoneInfo\0fillProfileStruct\0"
    "int32_t\0charProfileStruct*\0checkLen"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_ZoneMgr[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
      17,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       7,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    0,   99,    2, 0x06 /* Public */,
       1,    1,  100,    2, 0x06 /* Public */,
       1,    3,  103,    2, 0x06 /* Public */,
      10,    1,  110,    2, 0x06 /* Public */,
      13,    1,  113,    2, 0x06 /* Public */,
      13,    3,  116,    2, 0x06 /* Public */,
      15,    2,  123,    2, 0x06 /* Public */,

 // slots: name, argc, parameters, tag, flags
      17,    0,  128,    2, 0x0a /* Public */,
      18,    0,  129,    2, 0x0a /* Public */,
      19,    3,  130,    2, 0x09 /* Protected */,
      21,    2,  137,    2, 0x09 /* Protected */,
      22,    3,  142,    2, 0x09 /* Protected */,
      23,    3,  149,    2, 0x09 /* Protected */,
      24,    3,  156,    2, 0x09 /* Protected */,
      26,    3,  163,    2, 0x09 /* Protected */,
      28,    3,  170,    2, 0x09 /* Protected */,
      29,    4,  177,    2, 0x09 /* Protected */,

 // signals: parameters
    QMetaType::Void,
    QMetaType::Void, QMetaType::QString,    3,
    QMetaType::Void, 0x80000000 | 4, 0x80000000 | 6, 0x80000000 | 8,    5,    7,    9,
    QMetaType::Void, 0x80000000 | 11,   12,
    QMetaType::Void, QMetaType::QString,    3,
    QMetaType::Void, 0x80000000 | 14, 0x80000000 | 6, 0x80000000 | 8,    2,    2,    2,
    QMetaType::Void, QMetaType::QString, QMetaType::QString,    3,   16,

 // slots: parameters
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 6, 0x80000000 | 8,    5,    2,    2,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 6,    5,    7,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 6, 0x80000000 | 8,   22,    2,    2,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 6, 0x80000000 | 8,   23,    2,    2,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 6, 0x80000000 | 8,   25,    2,    2,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 6, 0x80000000 | 8,   27,    7,    2,
    QMetaType::Void, 0x80000000 | 20, 0x80000000 | 6, 0x80000000 | 8,   27,    7,    2,
    0x80000000 | 30, 0x80000000 | 31, 0x80000000 | 20, 0x80000000 | 6, QMetaType::Bool,   12,   27,    7,   32,

       0        // eod
};

void ZoneMgr::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<ZoneMgr *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->zoneBegin(); break;
        case 1: _t->zoneBegin((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 2: _t->zoneBegin((*reinterpret_cast< const ClientZoneEntryStruct*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 3: _t->playerProfile((*reinterpret_cast< const charProfileStruct*(*)>(_a[1]))); break;
        case 4: _t->zoneChanged((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 5: _t->zoneChanged((*reinterpret_cast< const zoneChangeStruct*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 6: _t->zoneEnd((*reinterpret_cast< const QString(*)>(_a[1])),(*reinterpret_cast< const QString(*)>(_a[2]))); break;
        case 7: _t->saveZoneState(); break;
        case 8: _t->restoreZoneState(); break;
        case 9: _t->zoneEntryClient((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 10: _t->zonePlayer((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2]))); break;
        case 11: _t->zoneChange((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 12: _t->zoneNew((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 13: _t->zonePoints((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 14: _t->dynamicZonePoints((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 15: _t->dynamicZoneInfo((*reinterpret_cast< const uint8_t*(*)>(_a[1])),(*reinterpret_cast< size_t(*)>(_a[2])),(*reinterpret_cast< uint8_t(*)>(_a[3]))); break;
        case 16: { int32_t _r = _t->fillProfileStruct((*reinterpret_cast< charProfileStruct*(*)>(_a[1])),(*reinterpret_cast< const uint8_t*(*)>(_a[2])),(*reinterpret_cast< size_t(*)>(_a[3])),(*reinterpret_cast< bool(*)>(_a[4])));
            if (_a[0]) *reinterpret_cast< int32_t*>(_a[0]) = std::move(_r); }  break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (ZoneMgr::*)();
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&ZoneMgr::zoneBegin)) {
                *result = 0;
                return;
            }
        }
        {
            using _t = void (ZoneMgr::*)(const QString & );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&ZoneMgr::zoneBegin)) {
                *result = 1;
                return;
            }
        }
        {
            using _t = void (ZoneMgr::*)(const ClientZoneEntryStruct * , size_t , uint8_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&ZoneMgr::zoneBegin)) {
                *result = 2;
                return;
            }
        }
        {
            using _t = void (ZoneMgr::*)(const charProfileStruct * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&ZoneMgr::playerProfile)) {
                *result = 3;
                return;
            }
        }
        {
            using _t = void (ZoneMgr::*)(const QString & );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&ZoneMgr::zoneChanged)) {
                *result = 4;
                return;
            }
        }
        {
            using _t = void (ZoneMgr::*)(const zoneChangeStruct * , size_t , uint8_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&ZoneMgr::zoneChanged)) {
                *result = 5;
                return;
            }
        }
        {
            using _t = void (ZoneMgr::*)(const QString & , const QString & );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&ZoneMgr::zoneEnd)) {
                *result = 6;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject ZoneMgr::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_ZoneMgr.data,
    qt_meta_data_ZoneMgr,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *ZoneMgr::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *ZoneMgr::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_ZoneMgr.stringdata0))
        return static_cast<void*>(this);
    return QObject::qt_metacast(_clname);
}

int ZoneMgr::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
    if (_id < 0)
        return _id;
    if (_c == QMetaObject::InvokeMetaMethod) {
        if (_id < 17)
            qt_static_metacall(this, _c, _id, _a);
        _id -= 17;
    } else if (_c == QMetaObject::RegisterMethodArgumentMetaType) {
        if (_id < 17)
            *reinterpret_cast<int*>(_a[0]) = -1;
        _id -= 17;
    }
    return _id;
}

// SIGNAL 0
void ZoneMgr::zoneBegin()
{
    QMetaObject::activate(this, &staticMetaObject, 0, nullptr);
}

// SIGNAL 1
void ZoneMgr::zoneBegin(const QString & _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 1, _a);
}

// SIGNAL 2
void ZoneMgr::zoneBegin(const ClientZoneEntryStruct * _t1, size_t _t2, uint8_t _t3)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))) };
    QMetaObject::activate(this, &staticMetaObject, 2, _a);
}

// SIGNAL 3
void ZoneMgr::playerProfile(const charProfileStruct * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 3, _a);
}

// SIGNAL 4
void ZoneMgr::zoneChanged(const QString & _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 4, _a);
}

// SIGNAL 5
void ZoneMgr::zoneChanged(const zoneChangeStruct * _t1, size_t _t2, uint8_t _t3)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t3))) };
    QMetaObject::activate(this, &staticMetaObject, 5, _a);
}

// SIGNAL 6
void ZoneMgr::zoneEnd(const QString & _t1, const QString & _t2)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))), const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t2))) };
    QMetaObject::activate(this, &staticMetaObject, 6, _a);
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
