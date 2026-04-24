/****************************************************************************
** Meta object code from reading C++ file 'filtermgr.h'
**
** Created by: The Qt Meta Object Compiler version 67 (Qt 5.15.13)
**
** WARNING! All changes made in this file will be lost!
*****************************************************************************/

#include <memory>
#include "../../../../showeq-daemon/src/filtermgr.h"
#include <QtCore/qbytearray.h>
#include <QtCore/qmetatype.h>
#if !defined(Q_MOC_OUTPUT_REVISION)
#error "The header file 'filtermgr.h' doesn't include <QObject>."
#elif Q_MOC_OUTPUT_REVISION != 67
#error "This file was generated using the moc from 5.15.13. It"
#error "cannot be used with the include files from this version of Qt."
#error "(The moc has changed too much.)"
#endif

QT_BEGIN_MOC_NAMESPACE
QT_WARNING_PUSH
QT_WARNING_DISABLE_DEPRECATED
struct qt_meta_stringdata_FilterMgr_t {
    QByteArrayData data[15];
    char stringdata0[179];
};
#define QT_MOC_LITERAL(idx, ofs, len) \
    Q_STATIC_BYTE_ARRAY_DATA_HEADER_INITIALIZER_WITH_OFFSET(len, \
    qptrdiff(offsetof(qt_meta_stringdata_FilterMgr_t, stringdata0) + ofs \
        - idx * sizeof(QByteArrayData)) \
    )
static const qt_meta_stringdata_FilterMgr_t qt_meta_stringdata_FilterMgr = {
    {
QT_MOC_LITERAL(0, 0, 9), // "FilterMgr"
QT_MOC_LITERAL(1, 10, 14), // "filtersChanged"
QT_MOC_LITERAL(2, 25, 0), // ""
QT_MOC_LITERAL(3, 26, 21), // "runtimeFiltersChanged"
QT_MOC_LITERAL(4, 48, 7), // "uint8_t"
QT_MOC_LITERAL(5, 56, 4), // "flag"
QT_MOC_LITERAL(6, 61, 11), // "loadFilters"
QT_MOC_LITERAL(7, 73, 10), // "filterFile"
QT_MOC_LITERAL(8, 84, 11), // "saveFilters"
QT_MOC_LITERAL(9, 96, 11), // "listFilters"
QT_MOC_LITERAL(10, 108, 8), // "loadZone"
QT_MOC_LITERAL(11, 117, 13), // "zoneShortName"
QT_MOC_LITERAL(12, 131, 15), // "loadZoneFilters"
QT_MOC_LITERAL(13, 147, 15), // "listZoneFilters"
QT_MOC_LITERAL(14, 163, 15) // "saveZoneFilters"

    },
    "FilterMgr\0filtersChanged\0\0"
    "runtimeFiltersChanged\0uint8_t\0flag\0"
    "loadFilters\0filterFile\0saveFilters\0"
    "listFilters\0loadZone\0zoneShortName\0"
    "loadZoneFilters\0listZoneFilters\0"
    "saveZoneFilters"
};
#undef QT_MOC_LITERAL

static const uint qt_meta_data_FilterMgr[] = {

 // content:
       8,       // revision
       0,       // classname
       0,    0, // classinfo
      10,   14, // methods
       0,    0, // properties
       0,    0, // enums/sets
       0,    0, // constructors
       0,       // flags
       2,       // signalCount

 // signals: name, argc, parameters, tag, flags
       1,    0,   64,    2, 0x06 /* Public */,
       3,    1,   65,    2, 0x06 /* Public */,

 // slots: name, argc, parameters, tag, flags
       6,    0,   68,    2, 0x0a /* Public */,
       6,    1,   69,    2, 0x0a /* Public */,
       8,    0,   72,    2, 0x0a /* Public */,
       9,    0,   73,    2, 0x0a /* Public */,
      10,    1,   74,    2, 0x0a /* Public */,
      12,    0,   77,    2, 0x0a /* Public */,
      13,    0,   78,    2, 0x0a /* Public */,
      14,    0,   79,    2, 0x0a /* Public */,

 // signals: parameters
    QMetaType::Void,
    QMetaType::Void, 0x80000000 | 4,    5,

 // slots: parameters
    QMetaType::Void,
    QMetaType::Void, QMetaType::QString,    7,
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void, QMetaType::QString,   11,
    QMetaType::Void,
    QMetaType::Void,
    QMetaType::Void,

       0        // eod
};

void FilterMgr::qt_static_metacall(QObject *_o, QMetaObject::Call _c, int _id, void **_a)
{
    if (_c == QMetaObject::InvokeMetaMethod) {
        auto *_t = static_cast<FilterMgr *>(_o);
        (void)_t;
        switch (_id) {
        case 0: _t->filtersChanged(); break;
        case 1: _t->runtimeFiltersChanged((*reinterpret_cast< uint8_t(*)>(_a[1]))); break;
        case 2: _t->loadFilters(); break;
        case 3: _t->loadFilters((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 4: _t->saveFilters(); break;
        case 5: _t->listFilters(); break;
        case 6: _t->loadZone((*reinterpret_cast< const QString(*)>(_a[1]))); break;
        case 7: _t->loadZoneFilters(); break;
        case 8: _t->listZoneFilters(); break;
        case 9: _t->saveZoneFilters(); break;
        default: ;
        }
    } else if (_c == QMetaObject::IndexOfMethod) {
        int *result = reinterpret_cast<int *>(_a[0]);
        {
            using _t = void (FilterMgr::*)();
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&FilterMgr::filtersChanged)) {
                *result = 0;
                return;
            }
        }
        {
            using _t = void (FilterMgr::*)(uint8_t );
            if (*reinterpret_cast<_t *>(_a[1]) == static_cast<_t>(&FilterMgr::runtimeFiltersChanged)) {
                *result = 1;
                return;
            }
        }
    }
}

QT_INIT_METAOBJECT const QMetaObject FilterMgr::staticMetaObject = { {
    QMetaObject::SuperData::link<QObject::staticMetaObject>(),
    qt_meta_stringdata_FilterMgr.data,
    qt_meta_data_FilterMgr,
    qt_static_metacall,
    nullptr,
    nullptr
} };


const QMetaObject *FilterMgr::metaObject() const
{
    return QObject::d_ptr->metaObject ? QObject::d_ptr->dynamicMetaObject() : &staticMetaObject;
}

void *FilterMgr::qt_metacast(const char *_clname)
{
    if (!_clname) return nullptr;
    if (!strcmp(_clname, qt_meta_stringdata_FilterMgr.stringdata0))
        return static_cast<void*>(this);
    return QObject::qt_metacast(_clname);
}

int FilterMgr::qt_metacall(QMetaObject::Call _c, int _id, void **_a)
{
    _id = QObject::qt_metacall(_c, _id, _a);
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

// SIGNAL 0
void FilterMgr::filtersChanged()
{
    QMetaObject::activate(this, &staticMetaObject, 0, nullptr);
}

// SIGNAL 1
void FilterMgr::runtimeFiltersChanged(uint8_t _t1)
{
    void *_a[] = { nullptr, const_cast<void*>(reinterpret_cast<const void*>(std::addressof(_t1))) };
    QMetaObject::activate(this, &staticMetaObject, 1, _a);
}
QT_WARNING_POP
QT_END_MOC_NAMESPACE
