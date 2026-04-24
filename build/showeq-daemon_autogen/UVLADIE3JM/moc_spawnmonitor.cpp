/****************************************************************************
** Meta object code from reading C++ file 'spawnmonitor.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/spawnmonitor.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'spawnmonitor.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_SpawnMonitor_t {
    QByteArrayData data[26];
    char stringdata0[285];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_SpawnMonitor_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_SpawnMonitor_t qt_meta_stringdata_SpawnMonitor = {
    {
QT_MOC_LITERAL(0, 0, 12), // "SpawnMonitor"
QT_MOC_LITERAL(1, 13, 13), // "newSpawnPoint"
QT_MOC_LITERAL(2, 27, 0), // ""
QT_MOC_LITERAL(3, 28, 17), // "const SpawnPoint*"
QT_MOC_LITERAL(4, 46, 10), // "spawnPoint"
QT_MOC_LITERAL(5, 57, 16), // "clearSpawnPoints"
QT_MOC_LITERAL(6, 74, 16), // "selectionChanged"
QT_MOC_LITERAL(7, 91, 8), // "selected"
QT_MOC_LITERAL(8, 100, 7), // "setName"
QT_MOC_LITERAL(9, 108, 2), // "sp"
QT_MOC_LITERAL(10, 111, 4), // "name"
QT_MOC_LITERAL(11, 116, 11), // "setModified"
QT_MOC_LITERAL(12, 128, 11), // "SpawnPoint*"
QT_MOC_LITERAL(13, 140, 9), // "changedSp"
QT_MOC_LITERAL(14, 150, 11), // "setSelected"
QT_MOC_LITERAL(15, 162, 5), // "clear"
QT_MOC_LITERAL(16, 168, 16), // "deleteSpawnPoint"
QT_MOC_LITERAL(17, 185, 8), // "newSpawn"
QT_MOC_LITERAL(18, 194, 11), // "const Item*"
QT_MOC_LITERAL(19, 206, 4), // "item"
QT_MOC_LITERAL(20, 211, 9), // "killSpawn"
QT_MOC_LITERAL(21, 221, 11), // "zoneChanged"
QT_MOC_LITERAL(22, 233, 11), // "newZoneName"
QT_MOC_LITERAL(23, 245, 7), // "zoneEnd"
QT_MOC_LITERAL(24, 253, 15), // "saveSpawnPoints"
QT_MOC_LITERAL(25, 269, 15) // "loadSpawnPoints"

    },
    "SpawnMonitor\0newSpawnPoint\0\0"
    "const SpawnPoint*\0spawnPoint\0"
    "clearSpawnPoints\0selectionChanged\0"
    "selected\0setName\0sp\0name\0setModified\0"
    "SpawnPoint*\0changedSp\0setSelected\0"
    "clear\0deleteSpawnPoint\0newSpawn\0"
    "const Item*\0item\0killSpawn\0zoneChanged\0"
    "newZoneName\0zoneEnd\0saveSpawnPoints\0"
    "loadSpawnPoints"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_SpawnMonitor[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
      14,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       3,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    1,   84,    2, 0x06 /* Public */,
       5,    0,   87,    2, 0x06 /* Public */,
       6,    1,   88,    2, 0x06 /* Public */,

 // slots: name, argc, parameters, tag, flags
       8,    2,   91,    2, 0x0a /* Public */,
      11,    1,   96,    2, 0x0a /* Public */,
      14,    1,   99,    2, 0x0a /* Public */,
      15,    0,  102,    2, 0x0a /* Public */,
      16,    1,  103,    2, 0x0a /* Public */,
      17,    1,  106,    2, 0x0a /* Public */,
      20,    1,  109,    2, 0x0a /* Public */,
      21,    1,  112,    2, 0x0a /* Public */,
      23,    1,  115,    2, 0x0a /* Public */,
      24,    0,  118,    2, 0x0a /* Public */,
      25,    0,  119,    2, 0x0a /* Public */,

 // signals: parameters
    QMetaType::Void, 0x80000000 | 3,    4,
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 3,    7,

 // slots: parameters
    QMetaType::Void, 0x80000000 | 3, QMetaType::QString,    9,   10,
    QMetaType::Void, 0x80000000 | 12,   13,
    QMetaType::Void, 0x80000000 | 3,    9,
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 3,    9,
    QMetaType::Void, 0x80000000 | 18,   19,
    QMetaType::Void, 0x80000000 | 18,   19,
    QMetaType::Void, QMetaType::QString,   22,
    QMetaType::Void, QMetaType::QString,   22,
    QMetaType::Void,
    QMetaType::Void,

       0        // eod
};

void SpawnMonitor::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<SpawnMonitor *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->newSpawnPoint((*reinterpret_cast< const SpawnPoint*(*)>(_a[1]))); break;
        case 1: _t->clearSpawnPoints(); break;
        case 2: _t->selectionChanged((*reinterpret_cast< const SpawnPoint*(*)>(_a[1]))); break;
        case 3: _t->setName((*reinterpret_cast< const SpawnPoint*(*)>(_a[1])),(*reinterpret_cast< const QString(*)>(_a[2]))); break;
        case 4: _t->setModified((*reinterpret_cast< SpawnPoint*(*)>(_a[1]))); break;
        case 5: _t->setSelected((*reinterpret_cast< const SpawnPoint*(*)>(_a[1]))); break;
        case 6: _t->clear(); break;
        case 7: _t->deleteSpawnPoint((*reinterpret_cast< const SpawnPoint*(*)>(_a[1]))); break;
        case 8: _t->newSpawn((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 9: _t->killSpawn((*reinterpret_cast< const Item*(*)>(_a[1]))); break;
        case 10: _t->zoneChanged((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 11: _t->zoneEnd((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 12: _t->saveSpawnPoints(); break;
        case 13: _t->loadSpawnPoints(); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (SpawnMonitor::*)(const SpawnPoint * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&SpawnMonitor::newSpawnPoint)) {
                *result = 0;
                return;
            }
        }
        {
            using _t = void (SpawnMonitor::*)();
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&SpawnMonitor::clearSpawnPoints)) {
                *result = 1;
                return;
            }
        }
        {
            using _t = void (SpawnMonitor::*)(const SpawnPoint * );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&SpawnMonitor::selectionChanged)) {
                *result = 2;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject SpawnMonitor::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_SpawnMonitor.data,
    qt_meta_data_SpawnMonitor,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *SpawnMonitor::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *SpawnMonitor::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_SpawnMonitor.stringdata0))
        return static_cast<void*>(this);
    return QObject::qt_metacast(_clname);
}

int SpawnMonitor::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
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
void SpawnMonitor::newSpawnPoint(const SpawnPoint * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 0, _a);
}

// SIGNAL 1
void SpawnMonitor::clearSpawnPoints()
{
    QMetaObject::activate(this, &staticMetaObject, 1, nullptr);
}

// SIGNAL 2
void SpawnMonitor::selectionChanged(const SpawnPoint * _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 2, _a);
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
